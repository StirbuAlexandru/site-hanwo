// Backend server with Supabase database
import http from "http";
import fs from "fs";
import path from "path";
import https from "https";
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const UPLOADS_DIR = path.resolve("./server/uploads");

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERROR: Missing Supabase configuration in .env file");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
console.log("Supabase connected:", SUPABASE_URL);

// Admin password (set in .env)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "hanwo2024";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "hanwo-admin-secret-token-2024";

function ensureUploadsDir() {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to ensure uploads dir:", err);
  }
}

// Helper function to save images locally
const PUBLIC_UPLOADS_DIR = path.resolve('./public/uploads');

function saveImageLocally(fileData, fileName, folder = 'products') {
  const folderPath = path.join(PUBLIC_UPLOADS_DIR, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, fileData);
  
  // Return the public URL (relative path that Vite will serve)
  return `/uploads/${folder}/${fileName}`;
}

function deleteLocalImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  const filePath = path.join('./public', imageUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('Deleted image:', filePath);
  }
}

// Keep Supabase upload for hero image (already working)
async function uploadToSupabaseStorage(fileData, fileName, folder = 'hero') {
  const filePath = `${folder}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, fileData, {
      contentType: getContentType(fileName),
      upsert: true
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return types[ext] || 'application/octet-stream';
}

function sendJSON(res, status, obj) {
  const payload = JSON.stringify(obj);
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? 'https://hanwo.ro' 
    : '*';
  
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  });
  res.end(payload);
}

// Proxy function to fetch images from Supabase and serve them
function proxySupabaseImage(imageUrl, res) {
  console.log('Proxying image:', imageUrl);
  
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? 'https://hanwo.ro' 
    : '*';
  
  https.get(imageUrl, (proxyRes) => {
    console.log('Proxy response status:', proxyRes.statusCode);
    const contentType = proxyRes.headers['content-type'] || 'image/jpeg';
    
    // Collect all chunks
    const chunks = [];
    proxyRes.on('data', (chunk) => chunks.push(chunk));
    proxyRes.on('end', () => {
      const imageBuffer = Buffer.concat(chunks);
      console.log('Image size:', imageBuffer.length, 'bytes');
      res.writeHead(proxyRes.statusCode, {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length,
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'public, max-age=31536000'
      });
      res.end(imageBuffer);
    });
  }).on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500);
    res.end('Image proxy error');
  });
}

// Parse multipart form data (binary-safe)
function parseMultipart(req, callback) {
  const contentType = req.headers['content-type'];
  const boundary = '--' + contentType.split('boundary=')[1];
  const boundaryBuffer = Buffer.from(boundary);
  
  let body = Buffer.alloc(0);
  
  req.on('data', chunk => {
    body = Buffer.concat([body, chunk]);
  });
  
  req.on('end', () => {
    const fields = {};
    
    // Find all boundary positions
    const positions = [];
    let pos = 0;
    while ((pos = body.indexOf(boundaryBuffer, pos)) !== -1) {
      positions.push(pos);
      pos += boundaryBuffer.length;
    }
    
    // Process each part
    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i] + boundaryBuffer.length + 2; // Skip boundary and CRLF
      const end = positions[i + 1] - 2; // Exclude trailing CRLF before next boundary
      
      if (start >= end) continue;
      
      const partBuffer = body.slice(start, end);
      
      // Find headers end (double CRLF)
      const headerEndPos = partBuffer.indexOf(Buffer.from('\r\n\r\n'));
      if (headerEndPos === -1) continue;
      
      const headersStr = partBuffer.slice(0, headerEndPos).toString('utf8');
      const content = partBuffer.slice(headerEndPos + 4);
      
      // Parse Content-Disposition header
      const nameMatch = headersStr.match(/name="([^"]+)"/);
      const filenameMatch = headersStr.match(/filename="([^"]+)"/);
      
      if (!nameMatch) continue;
      
      const fieldName = nameMatch[1];
      
      if (filenameMatch) {
        // It's a file
        fields[fieldName] = {
          fileName: filenameMatch[1],
          data: content
        };
      } else {
        // It's a regular field
        fields[fieldName] = content.toString('utf8').trim();
      }
    }
    
    callback(fields);
  });
}

// Serve static files from uploads
function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('File not found');
  }
  
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? 'https://hanwo.ro' 
    : '*';
  
  try {
    const data = fs.readFileSync(filePath);
    console.log('Serving image:', filePath, 'Size:', data.length, 'bytes');
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length,
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(data);
  } catch (err) {
    console.error('Error serving file:', err);
    res.writeHead(500);
    res.end('Server error');
  }
}

// Check authorization
function isAuthorized(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

ensureUploadsDir();

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

const server = http.createServer(async (req, res) => {
  // Request logging
  const startTime = Date.now();
  const logRequest = () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${status} (${duration}ms)`);
  };
  
  res.on('finish', logRequest);
  res.on('close', () => {
    if (!res.writableEnded) {
      console.log(`[WARN] Connection closed before response sent: ${req.method} ${req.url}`);
    }
  });

  // CORS configuration
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? 'https://hanwo.ro' 
    : '*';

  // Handle CORS preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400" // 24 hours cache
    });
    return res.end();
  }

  // Serve uploaded files from public/uploads
  if (req.url.startsWith('/uploads/')) {
    const filePath = path.join(PUBLIC_UPLOADS_DIR, req.url.replace('/uploads/', ''));
    console.log('Serving file:', filePath);
    return serveStatic(req, res, filePath);
  }

  // Proxy Supabase images - /api/image-proxy?url=...
  if (req.url.startsWith('/api/image-proxy')) {
    console.log('Image proxy request:', req.url);
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const imageUrl = urlParams.searchParams.get('url');
    console.log('Extracted URL:', imageUrl);
    if (imageUrl && imageUrl.includes('supabase.co')) {
      return proxySupabaseImage(imageUrl, res);
    } else {
      return sendJSON(res, 400, { ok: false, error: 'Invalid image URL' });
    }
  }

  // ==================== ADMIN LOGIN ====================
  if (req.url === "/api/admin/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
      try {
        const { password } = JSON.parse(body);
        if (password === ADMIN_PASSWORD) {
          return sendJSON(res, 200, { ok: true, token: ADMIN_TOKEN });
        }
        return sendJSON(res, 401, { ok: false, error: "Invalid password" });
      } catch (err) {
        return sendJSON(res, 400, { ok: false, error: "Invalid request" });
      }
    });
    return;
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
        const { name, email, message, phone, source, product } = json;
        if (!name || !email || !message) {
          return sendJSON(res, 400, { ok: false, error: "name,email,message required" });
        }

        // Insert into Supabase
        const { data: entry, error } = await supabase
          .from('messages')
          .insert([{
            name,
            email,
            phone: phone || null,
            message,
            source: source || "contact-page",
            product: product || null,
            is_read: false
          }])
          .select()
          .single();

        if (error) {
          console.error("Supabase insert error:", error);
          return sendJSON(res, 500, { ok: false, error: error.message });
        }

        // try to send email via Brevo if configured
        if (hasBrevoConfig) {
          const mailTo = process.env.EMAIL_TO || 'alexstirbu388@gmail.com';
          const subject = `[HANWO] Mesaj de la ${name}`;
          const text = `Nume: ${name}
Email: ${email}
Telefon: ${phone || '-'}
Sursă: ${source || 'contact-page'}

Mesaj:
${message}`;
          const html = `<p><strong>Nume:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Telefon:</strong> ${phone || '-'}</p><p><strong>Sursă:</strong> ${source || 'contact-page'}</p>${product ? `<p><strong>Produs:</strong> ${product}</p>` : ''}<hr/><p>${message.replace(/\n/g, '<br/>')}</p>`;
          
          try {
            await sendEmailViaBrevo(mailTo, subject, html, text);
            return sendJSON(res, 200, { ok: true, entry, emailSent: true });
          } catch (err) {
            console.error('Failed to send email via Brevo:', err.message);
            return sendJSON(res, 200, { ok: true, entry, emailSent: false, emailError: err.message });
          }
        }

        return sendJSON(res, 200, { ok: true, entry, emailSent: false });
      } catch (err) {
        console.error("Failed to process message:", err);
        return sendJSON(res, 500, { ok: false, error: "server error" });
      }
    });
    return;
  }

  if (req.url === "/api/messages" && req.method === "GET") {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return sendJSON(res, 200, { ok: true, messages: messages || [] });
    } catch (err) {
      console.error(err);
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== DELETE MESSAGE ====================
  if (req.url.match(/\/api\/messages\/[a-zA-Z0-9-]+$/) && req.method === "DELETE") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== MARK MESSAGE AS READ ====================
  if (req.url.match(/\/api\/messages\/[a-zA-Z0-9-]+\/read$/) && req.method === "PUT") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/')[3];
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== GET HERO IMAGE SETTINGS ====================
  if (req.url === "/api/settings/hero" && req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'heroImage')
        .single();

      if (error || !data) {
        return sendJSON(res, 200, { ok: true, heroImage: "" });
      }
      return sendJSON(res, 200, { ok: true, heroImage: data.value || "" });
    } catch (err) {
      return sendJSON(res, 200, { ok: true, heroImage: "" });
    }
  }

  // ==================== UPLOAD HERO IMAGE ====================
  if (req.url === "/api/settings/hero" && req.method === "POST") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    parseMultipart(req, async (fields) => {
      try {
        if (fields.heroImage && fields.heroImage.data) {
          const ext = path.extname(fields.heroImage.fileName).toLowerCase();
          const fileName = `hero-${Date.now()}${ext}`;
          
          // Upload to Supabase Storage
          const publicUrl = await uploadToSupabaseStorage(fields.heroImage.data, fileName, 'hero');
          
          // Save URL in settings table
          const { error } = await supabase
            .from('settings')
            .upsert({ key: 'heroImage', value: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'key' });
          
          if (error) throw error;
          return sendJSON(res, 200, { ok: true, heroImage: publicUrl });
        }
        return sendJSON(res, 400, { ok: false, error: "No file uploaded" });
      } catch (err) {
        console.error("Error uploading hero:", err);
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // ==================== SET HERO IMAGE FROM URL ====================
  if (req.url === "/api/hero-image-url" && req.method === "POST") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { url } = JSON.parse(body);
        if (!url) {
          return sendJSON(res, 400, { ok: false, error: "URL required" });
        }
        
        // Save URL in settings table
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'heroImage', value: url, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        
        if (error) throw error;
        return sendJSON(res, 200, { ok: true, heroImage: url });
      } catch (err) {
        console.error("Error setting hero image URL:", err);
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // ==================== GET PROMOTIONS ====================
  if (req.url === "/api/promotions" && req.method === "GET") {
    try {
      const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return sendJSON(res, 200, { ok: true, promotions: promotions || [] });
    } catch (err) {
      return sendJSON(res, 200, { ok: true, promotions: [] });
    }
  }

  // ==================== ADD PROMOTION ====================
  if (req.url === "/api/promotions" && req.method === "POST") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    parseMultipart(req, async (fields) => {
      try {
        let imagePath = "";
        if (fields.image && fields.image.data) {
          const ext = path.extname(fields.image.fileName).toLowerCase();
          const fileName = `promo-${Date.now()}${ext}`;
          
          // Upload to Supabase Storage
          imagePath = await uploadToSupabaseStorage(fields.image.data, fileName, 'promotions');
        }
        
        const { data: promotion, error } = await supabase
          .from('promotions')
          .insert([{
            name: fields.title || "",
            image: imagePath,
            old_price: fields.oldPrice || "",
            new_price: fields.price || "",
            discount: fields.discount || "",
            link: fields.link || ""
          }])
          .select()
          .single();
        
        if (error) throw error;
        return sendJSON(res, 200, { ok: true, promotion });
      } catch (err) {
        console.error("Error adding promotion:", err);
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // ==================== UPDATE PROMOTION ====================
  if (req.url.match(/\/api\/promotions\/[a-zA-Z0-9-]+$/) && req.method === "PUT") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    parseMultipart(req, async (fields) => {
      try {
        // Get existing promotion
        const { data: existing } = await supabase
          .from('promotions')
          .select('*')
          .eq('id', id)
          .single();

        let imagePath = existing?.image || "";
        
        // If new image uploaded, use it
        if (fields.image && fields.image.data) {
          const ext = path.extname(fields.image.fileName).toLowerCase();
          const fileName = `promo-${Date.now()}${ext}`;
          imagePath = await uploadToSupabaseStorage(fields.image.data, fileName, 'promotions');
        }
        
        const { data: promotion, error } = await supabase
          .from('promotions')
          .update({
            name: fields.title || "",
            image: imagePath,
            old_price: fields.oldPrice || "",
            new_price: fields.price || "",
            discount: fields.discount || "",
            link: fields.link || ""
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return sendJSON(res, 200, { ok: true, promotion });
      } catch (err) {
        console.error("Error updating promotion:", err);
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // ==================== DELETE PROMOTION ====================
  if (req.url.match(/\/api\/promotions\/[a-zA-Z0-9-]+$/) && req.method === "DELETE") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== GET STORED IMAGES ====================
  if (req.url === "/api/stored-images" && req.method === "GET") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .list('products', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      // Generate public URLs for each image
      const images = (data || []).map(file => {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`products/${file.name}`);
        return {
          name: file.name,
          url: urlData.publicUrl,
          created_at: file.created_at
        };
      });

      return sendJSON(res, 200, { ok: true, images });
    } catch (err) {
      console.error('Error fetching stored images:', err);
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== GET STORED HERO IMAGES ====================
  if (req.url === "/api/stored-hero-images" && req.method === "GET") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .list('hero', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      // Generate public URLs for each image
      const images = (data || []).map(file => {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`hero/${file.name}`);
        return {
          name: file.name,
          url: urlData.publicUrl,
          created_at: file.created_at
        };
      });

      return sendJSON(res, 200, { ok: true, images });
    } catch (err) {
      console.error('Error fetching stored hero images:', err);
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== GET ALL PRODUCTS ====================
  if (req.url === "/api/products" && req.method === "GET") {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return sendJSON(res, 200, { ok: true, products: products || [] });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== GET SINGLE PRODUCT ====================
  if (req.url.match(/\/api\/products\/[a-zA-Z0-9-]+$/) && req.method === "GET") {
    const idOrSlug = req.url.split('/').pop();
    try {
      // Try to find by slug first, then by id
      let { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', idOrSlug)
        .single();

      if (!product) {
        const result = await supabase
          .from('products')
          .select('*')
          .eq('id', idOrSlug)
          .single();
        product = result.data;
        error = result.error;
      }

      if (error || !product) {
        return sendJSON(res, 404, { ok: false, error: "Product not found" });
      }
      return sendJSON(res, 200, { ok: true, product });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== ADD PRODUCT ====================
  if (req.url === "/api/products" && req.method === "POST") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    parseMultipart(req, async (fields) => {
      try {
        // Use existing image URL or upload new main image
        let mainImageUrl = "";
        if (fields.mainImageUrl) {
          // Use existing stored image URL
          mainImageUrl = fields.mainImageUrl;
          console.log('Using existing image URL:', mainImageUrl);
        } else if (fields.mainImage && fields.mainImage.data) {
          const ext = path.extname(fields.mainImage.fileName).toLowerCase();
          const fileName = `product-main-${Date.now()}${ext}`;
          mainImageUrl = await uploadToSupabaseStorage(fields.mainImage.data, fileName, 'products');
          console.log('Uploaded main image to Supabase:', mainImageUrl);
        }

        // Upload additional images to Supabase Storage
        const imageUrls = [];
        for (let i = 0; i < 10; i++) {
          const fieldName = `image${i}`;
          if (fields[fieldName] && fields[fieldName].data) {
            const ext = path.extname(fields[fieldName].fileName).toLowerCase();
            const fileName = `product-${Date.now()}-${i}${ext}`;
            const url = await uploadToSupabaseStorage(fields[fieldName].data, fileName, 'products');
            console.log('Uploaded image to Supabase:', url);
            imageUrls.push(url);
          }
        }

        // Parse specifications if provided
        let specifications = null;
        if (fields.specifications) {
          try {
            specifications = JSON.parse(fields.specifications);
          } catch (e) {
            specifications = null;
          }
        }

        const { data: product, error } = await supabase
          .from('products')
          .insert([{
            name: fields.name || "",
            slug: fields.slug || fields.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `product-${Date.now()}`,
            category: fields.category || "tractoare",
            price: fields.price || "",
            description: fields.description || "",
            specifications,
            main_image: mainImageUrl,
            images: imageUrls,
            is_active: true,
            sort_order: parseInt(fields.sort_order) || 0
          }])
          .select()
          .single();

        if (error) throw error;
        return sendJSON(res, 200, { ok: true, product });
      } catch (err) {
        console.error("Error adding product:", err);
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // ==================== UPDATE PRODUCT ====================
  if (req.url.match(/\/api\/products\/[a-zA-Z0-9-]+$/) && req.method === "PUT") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    parseMultipart(req, async (fields) => {
      try {
        const updateData = {
          updated_at: new Date().toISOString()
        };

        // Only update fields that are provided
        if (fields.name) updateData.name = fields.name;
        if (fields.slug) updateData.slug = fields.slug;
        if (fields.category) updateData.category = fields.category;
        if (fields.price) updateData.price = fields.price;
        if (fields.description) updateData.description = fields.description;
        if (fields.sort_order) updateData.sort_order = parseInt(fields.sort_order);
        if (fields.is_active !== undefined) updateData.is_active = fields.is_active === 'true';

        // Upload new main image if provided (to Supabase) or use existing URL
        if (fields.mainImageUrl) {
          updateData.main_image = fields.mainImageUrl;
          console.log('Using existing image URL for update:', fields.mainImageUrl);
        } else if (fields.mainImage && fields.mainImage.data) {
          const ext = path.extname(fields.mainImage.fileName).toLowerCase();
          const fileName = `product-main-${Date.now()}${ext}`;
          updateData.main_image = await uploadToSupabaseStorage(fields.mainImage.data, fileName, 'products');
        }

        // Handle additional images
        if (fields.existingImages) {
          try {
            updateData.images = JSON.parse(fields.existingImages);
          } catch (e) {}
        }

        // Upload new additional images to Supabase
        for (let i = 0; i < 10; i++) {
          const fieldName = `newImage${i}`;
          if (fields[fieldName] && fields[fieldName].data) {
            const ext = path.extname(fields[fieldName].fileName).toLowerCase();
            const fileName = `product-${Date.now()}-${i}${ext}`;
            const url = await uploadToSupabaseStorage(fields[fieldName].data, fileName, 'products');
            if (!updateData.images) updateData.images = [];
            updateData.images.push(url);
          }
        }

        // Parse specifications if provided
        if (fields.specifications) {
          try {
            updateData.specifications = JSON.parse(fields.specifications);
          } catch (e) {}
        }

        const { data: product, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return sendJSON(res, 200, { ok: true, product });
      } catch (err) {
        console.error("Error updating product:", err);
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // ==================== DELETE PRODUCT ====================
  if (req.url.match(/\/api\/products\/[a-zA-Z0-9-]+$/) && req.method === "DELETE") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // ==================== TESTIMONIALS ROUTES ====================
  
  // GET ALL TESTIMONIALS
  if (req.url === "/api/testimonials" && req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return sendJSON(res, 200, { ok: true, testimonials: data });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // CREATE TESTIMONIAL
  if (req.url === "/api/testimonials" && req.method === "POST") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const { client_name, content, rating, location } = JSON.parse(body);
        
        if (!client_name || !content || !rating) {
          return sendJSON(res, 400, { ok: false, error: "Missing required fields" });
        }

        const { data, error } = await supabase
          .from('testimonials')
          .insert([{
            client_name,
            content,
            rating: parseInt(rating),
            location: location || null
          }])
          .select();

        if (error) throw error;
        return sendJSON(res, 201, { ok: true, testimonial: data[0] });
      } catch (err) {
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // UPDATE TESTIMONIAL
  if (req.url.match(/\/api\/testimonials\/[a-zA-Z0-9-]+$/) && req.method === "PUT") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const { client_name, content, rating, location } = JSON.parse(body);
        
        const { data, error } = await supabase
          .from('testimonials')
          .update({
            client_name,
            content,
            rating: parseInt(rating),
            location: location || null
          })
          .eq('id', id)
          .select();

        if (error) throw error;
        return sendJSON(res, 200, { ok: true, testimonial: data[0] });
      } catch (err) {
        return sendJSON(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  // DELETE TESTIMONIAL
  if (req.url.match(/\/api\/testimonials\/[a-zA-Z0-9-]+$/) && req.method === "DELETE") {
    if (!isAuthorized(req)) {
      return sendJSON(res, 401, { ok: false, error: "Unauthorized" });
    }
    const id = req.url.split('/').pop();
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { ok: false, error: err.message });
    }
  }

  // 404 - Route not found
  res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Credentials": "true"
  });
  res.end(JSON.stringify({
    ok: false,
    error: "Route not found",
    path: req.url,
    method: req.method
  }));
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled Promise Rejection:', reason);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1); // Exit on fatal errors
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[INFO] SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('[INFO] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[INFO] SIGINT received, closing server gracefully...');
  server.close(() => {
    console.log('[INFO] Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 HANWO Backend Server`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📍 Environment: ${env}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🗄️  Database: Supabase (${SUPABASE_URL})`);
  console.log(`📧 Email: ${hasBrevoConfig ? 'Brevo API ✓' : 'Not configured'}`);
  console.log(`🔒 CORS Origin: ${env === 'production' ? 'https://hanwo.ro' : 'Any (*)'}`);  console.log(`${'='.repeat(50)}\n`);
});
