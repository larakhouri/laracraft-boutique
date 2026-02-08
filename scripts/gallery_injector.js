// Gallery Injector Script
// Usage: node scripts/gallery_injector.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// OR use SERVICE_ROLE_KEY if RLS blocks insert, but for now assuming anon or service key is available 
// If running locally as admin, service role key is better. 
// For this script to work, user needs to set SUPABASE_SERVICE_ROLE_KEY in .env.local usually.

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mock Data Source (Replace with CSV read or local file scan)
const GALLERY_DATA = [
    {
        image_url: '/product-ring.jpg',
        alt_text: 'Hand-Hammered Gold Ring',
        story: 'تفاصيل الذهب المطروق يدوياً تروي قصة الصبر والإتقان.'
    },
    {
        image_url: '/product-pendant.jpg',
        alt_text: 'Turquoise Pendant',
        story: 'حجر الفيروز الطبيعي يعكس زرقة السماء وصفاء الروح.'
    },
    {
        image_url: '/product-journal.jpg',
        alt_text: 'Leather Artisan Journal',
        story: 'ملمس الجلد الطبيعي يحفظ ذكرياتك بأناقة عبر الزمن.'
    },
    {
        image_url: '/<img>.png',
        alt: 'The Workshop',
        story: 'في هذا الركن الهادئ، تتحول المواد الخام إلى قطع فنية تنبض بالحياة.'
    }
];

async function injectGallery() {
    console.log('Starting Gallery Injection...');

    // 1. Get Category ID (Optional, if we link to product_categories)
    // Assuming 'Photo Gallery' exists from migration
    let categoryId = null;
    const { data: catData, error: catError } = await supabase
        .from('product_categories')
        .select('id')
        .eq('slug', 'lens-gallery')
        .single();

    if (catData) {
        categoryId = catData.id;
        console.log(`Found Category ID: ${categoryId}`);
    } else {
        console.log('Category not found, proceeding without tag.');
    }

    // 2. Insert Images
    for (const item of GALLERY_DATA) {
        const payload = {
            ...item,
            category_id: categoryId
        };

        const { data, error } = await supabase
            .from('gallery_images')
            .insert(payload)
            .select();

        if (error) {
            console.error(`Error inserting ${item.alt_text}:`, error.message);
        } else {
            console.log(`Inserted: ${item.alt_text}`);
        }
    }

    console.log('Injection Complete.');
}

injectGallery();
