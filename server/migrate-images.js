// Script pentru încărcarea imaginilor în Supabase Storage și actualizarea produselor
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const IMAGES_DIR = path.join(__dirname, '../src/assets/images/tractoare');

// Mapping: slug -> { main: 'filename', additional: ['file1', 'file2', ...] }
const productImages = {
  'tractor-50-cai-hanwo-504': {
    main: 'Tractor1_main.jpg',
    additional: ['Tractor1_1.jpg', 'Tractor1_2.jpg', 'Tractor1_3.jpg', 'Tractor1_4.jpg', 'Tractor1_5.jpg']
  },
  'tractor-65-cai-hanwo-604': {
    main: 'Tractor2_main.jpg',
    additional: ['Tractor2_1.jpg', 'Tractor2_2.jpg', 'Tractor2_3.jpg', 'Tractor2_4.jpg', 'Tractor2_5.jpg']
  },
  'tractor-75-cai-hanwo-704': {
    main: 'Tractor3_main.jpg',
    additional: ['Tractor3_1.jpg', 'Tractor3_2.jpg', 'Tractor3_3.jpg', 'Tractor3_4.jpg', 'Tractor3_5.jpg']
  },
  'tractor-50-cai-hanwo-504-incarcator': {
    main: 'Tractor4_main.jpg',
    additional: ['Tractor4_1.jpg', 'Tractor4_2.jpg', 'Tractor4_3.jpg', 'Tractor4_4.jpg', 'Tractor4_5.jpg']
  },
  'tractor-hanwo-604-incarcator': {
    main: 'Tractor5_main.jpg',
    additional: ['Tractor5_1.jpg', 'Tractor5_2.jpg', 'Tractor5_3.jpg', 'Tractor5_4.jpg', 'Tractor5_5.jpg']
  },
  'tractor-hanwo-504r': {
    main: 'Tractor6_main.jpg',
    additional: ['Tractor6_1.jpg', 'Tractor6_2.jpg', 'Tractor6_3.jpg']
  },
  'tractor-hanwo-507': {
    main: 'Tractor7_main.jpg',
    additional: ['Tractor7_1.jpg', 'Tractor7_2.jpg', 'Tractor7_3.jpg', 'Tractor7_4.jpg', 'Tractor7_5.jpg']
  }
};

async function uploadImage(filePath, fileName) {
  const fileData = fs.readFileSync(filePath);
  const storagePath = `products/${fileName}`;
  
  // Check if file exists
  const { data: existingFile } = await supabase.storage
    .from('images')
    .list('products', { search: fileName });
  
  if (existingFile && existingFile.length > 0) {
    // File exists, just return URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);
    return urlData.publicUrl;
  }
  
  // Upload file
  const { data, error } = await supabase.storage
    .from('images')
    .upload(storagePath, fileData, {
      contentType: 'image/jpeg',
      upsert: true
    });
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(storagePath);
  
  return urlData.publicUrl;
}

async function migrateImages() {
  console.log('Începem încărcarea imaginilor...\n');
  
  for (const [slug, images] of Object.entries(productImages)) {
    console.log(`\n📦 Procesez: ${slug}`);
    
    try {
      // Upload main image
      const mainImagePath = path.join(IMAGES_DIR, images.main);
      if (!fs.existsSync(mainImagePath)) {
        console.log(`  ⚠️  Imaginea principală nu există: ${images.main}`);
        continue;
      }
      
      const mainImageUrl = await uploadImage(mainImagePath, images.main);
      console.log(`  ✅ Imagine principală: ${images.main}`);
      
      // Upload additional images
      const additionalUrls = [];
      for (const imgFile of images.additional) {
        const imgPath = path.join(IMAGES_DIR, imgFile);
        if (fs.existsSync(imgPath)) {
          const url = await uploadImage(imgPath, imgFile);
          additionalUrls.push(url);
          console.log(`  ✅ Imagine: ${imgFile}`);
        } else {
          console.log(`  ⚠️  Lipsește: ${imgFile}`);
        }
      }
      
      // Update product in database
      const { error } = await supabase
        .from('products')
        .update({
          main_image: mainImageUrl,
          images: additionalUrls
        })
        .eq('slug', slug);
      
      if (error) throw error;
      
      console.log(`  ✅ Produs actualizat în baza de date!`);
      
    } catch (err) {
      console.error(`  ❌ Eroare: ${err.message}`);
    }
  }
  
  console.log('\n\n✅ Migrare imagini completă!');
}

migrateImages();
