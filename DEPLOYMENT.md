# Deployment Guide - HANWO Website

## Local Development
Folosești: `http://localhost:4000` pentru backend

## Production Deployment

### 1. **Frontend (Render/Netlify/Vercel)**
- Setează variabila de mediu:
  ```
  VITE_API_URL=https://hanwo-backend.onrender.com
  ```
- Build command: `npm run build`
- Publish directory: `dist`

### 2. **Backend (Render)**
- URL backend: `https://hanwo-backend.onrender.com`
- Setează variabilele de mediu în Render Dashboard:
  ```
  NODE_ENV=production
  SUPABASE_URL=https://uedadacazricyfrketqc.supabase.co
  SUPABASE_SERVICE_KEY=[your-service-key]
  ADMIN_PASSWORD=[your-password]
  ADMIN_TOKEN=[your-token]
  BREVO_API_KEY=[your-brevo-key]
  EMAIL_FROM=noreply@agrorus.ro
  EMAIL_TO=alexstirbu388@gmail.com
  ```

### 3. **CORS Configuration**
Serverul permite automat:
- Development: `*` (orice origine)
- Production (`NODE_ENV=production`): `https://hanwo.ro`

### 4. **Cum funcționează**
- **Local**: `VITE_API_URL` = empty → folosește `http://localhost:4000`
- **Production**: `VITE_API_URL` = `https://hanwo-backend.onrender.com`

### 5. **Testare**
```bash
# Local
npm run dev

# Build pentru production
npm run build
npm run preview
```

---
**IMPORTANT**: Actualizează `https://hanwo-backend.onrender.com` cu URL-ul real al backend-ului tău de pe Render!
