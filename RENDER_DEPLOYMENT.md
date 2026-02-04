# Deployment pe Render - Full-Stack

Acest ghid te ajută să publici întregul site (frontend + backend) pe un singur serviciu Render.

## 📋 Pregătire

### 1. Verifică că ai toate dependențele
```bash
# În rădăcina proiectului
npm install

# În folderul server
cd server
npm install
cd ..
```

### 2. Testează local în modul production
```bash
# Build frontend
npm run build

# Rulează serverul în modul production
cd server
NODE_ENV=production npm start
```

Accesează `http://localhost:4000` - ar trebui să vezi site-ul complet.

## 🚀 Deployment pe Render

### 1. Creează un nou Web Service

1. Mergi pe [render.com](https://render.com)
2. Click pe **New +** → **Web Service**
3. Conectează repository-ul tău GitHub
4. Selectează repository-ul `hanwo`

### 2. Configurează serviciul

**Build Command:**
```
npm install && npm run build && cd server && npm install
```

**Start Command:**
```
cd server && npm start
```

**Environment:**
- Runtime: **Node**
- Region: **Frankfurt** (cel mai aproape de România)
- Instance Type: **Free**

### 3. Adaugă Environment Variables

În pagina de settings, adaugă următoarele variabile:

```env
NODE_ENV=production
PORT=10000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Admin
ADMIN_PASSWORD=your_admin_password
ADMIN_TOKEN=your_secret_token

# Email (Brevo)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@hanwo.ro
EMAIL_TO=contact@hanwo.ro
```

**Important:** Nu include `VITE_API_URL` - frontend și backend sunt pe același server!

### 4. Deploy

Click pe **Create Web Service**. Render va:
1. Instala dependențele root
2. Builda frontend-ul (Vite)
3. Instala dependențele backend-ului
4. Porni serverul

## 🔗 După deployment

### Actualizează domeniul

Site-ul va fi disponibil la: `https://hanwo-fullstack.onrender.com` (sau URL-ul tău Render)

### Conectează domeniul custom

1. În Render dashboard, mergi la Settings → Custom Domain
2. Adaugă domeniul tău (ex: `www.hanwo.ro`)
3. Configurează DNS-ul la provider-ul tău:
   - Type: **CNAME**
   - Name: **www**
   - Value: **hanwo-fullstack.onrender.com**

## 📁 Structura deployment-ului

```
hanwo/
├── dist/                    # Frontend build (generat)
│   ├── index.html
│   ├── assets/
│   └── ...
├── server/
│   ├── index.js            # Backend server (servește și frontend)
│   └── package.json
├── src/                    # Frontend source
├── package.json            # Root package.json (frontend)
├── render.yaml             # Configurație Render
└── vite.config.js          # Vite config
```

## 🔍 Verificare

După deployment, verifică:

1. **Homepage:** `https://your-app.onrender.com/`
2. **API:** `https://your-app.onrender.com/api/products`
3. **Admin:** `https://your-app.onrender.com/admin`

## 💡 Note importante

- **Prima cerere poate dura 30-50 secunde** (Render Free tier "dorm" după inactivitate)
- **Fișierele statice sunt cache-ate** pentru performanță maximă
- **SPA routing funcționează** - toate rutele frontend merg direct
- **Nu mai ai nevoie de Hostgate** - totul este pe Render

## 🐛 Troubleshooting

### Site-ul nu se încarcă
- Verifică logs în Render dashboard
- Asigură-te că `NODE_ENV=production` este setat
- Verifică că folderul `dist/` a fost generat

### API nu funcționează
- Verifică că toate variabilele de mediu sunt setate
- Logs ar trebui să arate: `🚀 HANWO Full-Stack Server`

### Imagini lipsă
- Verifică că Supabase credentials sunt corecte
- Testează: `https://your-app.onrender.com/api/products`

## 🔄 Update deployment

Ori de câte ori faci push pe GitHub, Render va redeploya automat:

```bash
git add .
git commit -m "Update site"
git push origin main
```

Render va detecta schimbările și va rebuida totul automat! 🎉
