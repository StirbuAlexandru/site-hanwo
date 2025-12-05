// Minimal backend server to accept contact messages
// Uses only Node built-ins so no extra deps are required.
import http from "http";
import fs from "fs";
import path from "path";
import https from "https";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const PORT = process.env.PORT || 4000;
const DATA_DIR = path.resolve("./server/data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, "[]");
  } catch (err) {
    console.error("Failed to ensure data file:", err);
  }
}

function sendJSON(res, status, obj) {
  const payload = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

ensureDataFile();

// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const hasBrevoConfig = !!BREVO_API_KEY;

if (hasBrevoConfig) {
  console.log("Brevo API configured - emails will be sent");
} else {
  console.log("No Brevo API key found - messages will be stored but not emailed");
}

// Function to send email via Brevo API
async function sendEmailViaBrevo(to, subject, htmlContent, textContent) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: { email: process.env.EMAIL_FROM || "noreply@agrorus.ro", name: "HANWO Romania" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent
    });

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: responseData });
        } else {
          reject(new Error(`Brevo API error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  // Basic CORS preflight handling
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (req.url === "/api/messages" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) req.socket.destroy();
    });
    req.on("end", async () => {
      try {
        const json = JSON.parse(body || "{}");
        // basic validation
        const { name, email, message, phone, source } = json;
        if (!name || !email || !message) {
          return sendJSON(res, 400, { ok: false, error: "name,email,message required" });
        }

        const entry = {
          id: Date.now(),
          name,
          email,
          phone: phone || null,
          message,
          source: source || "contact-page",
          createdAt: new Date().toISOString(),
        };

        const raw = fs.readFileSync(MESSAGES_FILE, "utf-8");
        const arr = JSON.parse(raw || "[]");
        arr.push(entry);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(arr, null, 2));

        // try to send email via Brevo if configured
        if (hasBrevoConfig) {
          const mailTo = process.env.EMAIL_TO || 'alexstirbu388@gmail.com';
          const subject = `[HANWO] Mesaj de la ${name}`;
          const text = `Nume: ${name}
Email: ${email}
Telefon: ${phone || '-'}
Sursă: ${entry.source}

Mesaj:
${message}`;
          const html = `<p><strong>Nume:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Telefon:</strong> ${phone || '-'}</p><p><strong>Sursă:</strong> ${entry.source}</p>${entry.product ? `<p><strong>Produs:</strong> ${entry.product}</p>` : ''}<hr/><p>${message.replace(/\n/g, '<br/>')}</p>`;
          
          try {
            await sendEmailViaBrevo(mailTo, subject, html, text);
            return sendJSON(res, 200, { ok: true, entry, emailSent: true });
          } catch (err) {
            console.error('Failed to send email via Brevo:', err.message);
            return sendJSON(res, 200, { ok: true, entry, emailSent: false, emailError: err.message });
          }
        }

        // no transporter — still return success (stored)
        return sendJSON(res, 200, { ok: true, entry, emailSent: false, emailError: 'no-smtp-config' });
      } catch (err) {
        console.error("Failed to parse body or write message:", err);
        return sendJSON(res, 500, { ok: false, error: "server error" });
      }
    });
    return;
  }

  if (req.url === "/api/messages" && req.method === "GET") {
    try {
      const raw = fs.readFileSync(MESSAGES_FILE, "utf-8");
      const arr = JSON.parse(raw || "[]");
      return sendJSON(res, 200, { ok: true, messages: arr });
    } catch (err) {
      console.error(err);
      return sendJSON(res, 500, { ok: false });
    }
  }

  // default
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
