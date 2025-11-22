// Minimal backend server to accept contact messages
// Uses only Node built-ins so no extra deps are required.
import http from "http";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

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

// Configure mail transporter if SMTP env vars are present
let transporter = null;
const SMTP_HOST = process.env.SMTP_HOST;
if (SMTP_HOST) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    // optionally verify
    transporter.verify().then(() => console.log("SMTP transporter ready")).catch((e) => console.warn("SMTP verify failed", e.message));
  } catch (err) {
    console.error("Failed to create SMTP transporter", err);
    transporter = null;
  }
} else {
  console.log("No SMTP configuration found — messages will be stored but not emailed. Set SMTP_HOST/SMTP_USER/SMTP_PASS to enable.");
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

        // try to send email if transporter is configured
        if (transporter) {
          const mailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@' + (process.env.SMTP_HOST || 'localhost');
          const mailTo = process.env.EMAIL_TO || process.env.EMAIL_RECEIVER || process.env.SMTP_USER || mailFrom;
          const subject = `[HANWO] Mesaj de la ${name}`;
          const text = `Nume: ${name}\nEmail: ${email}\nTelefon: ${phone || '-'}\nSursă: ${entry.source}\n\nMesaj:\n${message}`;
          try {
            await transporter.sendMail({
              from: mailFrom,
              to: mailTo,
              subject,
              text,
              html: `<p><strong>Nume:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Telefon:</strong> ${phone || '-'}</p><p><strong>Sursă:</strong> ${entry.source}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
            });
            return sendJSON(res, 200, { ok: true, entry, emailSent: true });
          } catch (err) {
            console.error('Failed to send email:', err && err.message ? err.message : err);
            return sendJSON(res, 200, { ok: true, entry, emailSent: false, emailError: (err && err.message) || 'send failed' });
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
