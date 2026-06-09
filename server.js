const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const path = require('path');

app.use(express.json());

// Inisialisasi Supabase (Dapatkan URL dan KEY dari dashboard Supabase gratisan)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API: Ambil semua metode pembayaran langsung dari Database Cloud
app.get('/api/payment-methods', async (req, res) => {
    const { data, error } = await supabase.from('payment_methods').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// API: Update Metode Pembayaran dari Admin Panel ke Database Cloud
app.post('/api/payment-methods/save', async (req, res) => {
    const { id, name, type, account_number, account_name, is_active } = req.body;
    
    const { data, error } = await supabase
        .from('payment_methods')
        .upsert({ id, name, type, account_number, account_name, is_active: is_active === 'true' });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: 'Metode pembayaran aman tersimpan di cloud!' });
});

// ... Sisa API untuk admin-socials sesuaikan dengan pola upsert Supabase yang sama
