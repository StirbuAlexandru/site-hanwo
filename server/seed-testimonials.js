// Seed initial testimonials data
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERROR: Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const testimonials = [
  {
    client_name: "Ion Popescu",
    location: "Suceava",
    content: "Tractorul Hanwo pe care l-am cumpărat anul trecut funcționează impecabil. Consumul este redus, iar puterea este mai mult decât suficientă pentru terenul meu de 15 hectare. Service-ul a fost profesionist din prima zi.",
    rating: 5
  },
  {
    client_name: "Maria Tănase",
    location: "Cluj",
    content: "Am trecut la Hanwo după ce m-am săturat de reparații constante la tractorul vechi. Diferența este uriașă - fiabilitate, consum redus și dotări moderne care îmi fac munca mult mai ușoară.",
    rating: 5
  },
  {
    client_name: "Vasile Dima",
    location: "Buzău",
    content: "Folosești un tractor Hanwo o dată și nu mai vrei altceva. Raportul calitate-preț este excelent. Am recomandat deja trei prieteni fermieri și toți sunt mulțumiți.",
    rating: 5
  },
  {
    client_name: "Elena Ionescu",
    location: "Iași",
    content: "Service-ul lor este rapid și profesionist. Am avut nevoie de câteva piese de schimb și au ajuns în 2 zile. Echipa de suport este mereu disponibilă să ajute.",
    rating: 5
  },
  {
    client_name: "Mihai Stoica",
    location: "Arad",
    content: "Sunt foarte mulțumit de modul în care Hanwo a combinat tehnologia modernă cu un design robust. Tractorul meu de 65 CP trage orice tip de echipament fără probleme.",
    rating: 5
  },
  {
    client_name: "Cristina Pavel",
    location: "Brașov",
    content: "Pentru noi, investiția în Hanwo a fost cea mai bună decizie. Consumul redus de combustibil ne-a scăzut costurile cu 30%, iar fiabilitatea înseamnă mai puțin timp pierdut cu reparații.",
    rating: 5
  }
];

async function seedTestimonials() {
  console.log("Seeding testimonials...");
  
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonials)
      .select();
    
    if (error) {
      console.error("Error inserting testimonials:", error);
      process.exit(1);
    }
    
    console.log(`✅ Successfully added ${data.length} testimonials!`);
    console.log("Testimonials:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

seedTestimonials();
