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

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProduct() {
    const id = '95dcac63-666f-4348-8692-8b738fce9f11';
    console.log(`Checking for product ${id} in printing_guide...`);

    const { data, error } = await supabase
        .from('printing_guide')
        .select('title')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching product:', error.message);
        process.exit(1);
    }

    if (data) {
        console.log('✅ Product found:', data.title);
        process.exit(0);
    } else {
        console.log('❌ Product NOT found.');
        process.exit(1);
    }
}

checkProduct();
