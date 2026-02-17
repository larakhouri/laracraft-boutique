const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        env[match[1]] = value;
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProduct() {
    const id = '00480318-8f3f-4187-9210-ba72b398b9cb'; // Wood Prints
    console.log(`Debugging product ${id}...`);

    // Try fetching from printing_guide
    console.log('Fetching from printing_guide...');
    const { data, error } = await supabase
        .from('printing_guide')
        .select('*')
        .or(`id.eq.${id},external_id.eq.${id}`)
        .maybeSingle();

    if (error) {
        console.error('SUPABASE ERROR:', error);
    } else if (data) {
        console.log('✅ Found in printing_guide!');
        console.log('Data keys:', Object.keys(data));
        console.log('images:', data.images, typeof data.images);
        console.log('description:', data.description);
        console.log('description_de:', data.description_de);
        console.log('description_ar:', data.description_ar);
    } else {
        console.log('❌ Not found in printing_guide.');
    }
}

debugProduct();
