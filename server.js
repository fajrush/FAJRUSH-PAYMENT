const express = require('express');
const { kv } = require('@vercel/kv'); // Library bawaan Vercel
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data Default kalau di Database KV masih kosong
const defaultMethods = [
    { id: 'qris', name: 'QRIS All Payment', type: 'QRIS', account_number: 'https://link-qris.com/qris.jpg', account_name: 'Toko Fajrush', is_active: true },
    { id: 'dana', name: 'DANA', type: 'E-Wallet', account_number: '081234567890', account_name: 'Fajrush', is_active: true },
    { id: 'gopay', name: 'Gopay', type: 'E-Wallet', account_number: '081234567890', account_name: 'Fajrush', is_active: true },
    { id: 'seabank', name: 'SeaBank', type: 'Bank', account_number: '90123456789', account_name: 'Fajrush', is_active: true }
];

const defaultSocials = {
    active_platform: 'whatsapp',
    whatsapp_number: '6281234567890',
    whatsapp_message: 'Halo bos, saya sudah transfer.',
    telegram_username: 'fajrush_admin'
};

// ================= API METODE PEMBAYARAN =================

// Ambil Metode Pembayaran
app.get('/api/payment-methods', async (req, res) => {
    let methods = await kv.get('payment_methods');
    if (!methods) {
        await kv.set('payment_methods', defaultMethods);
        methods = defaultMethods;
    }
    res.json(methods);
});

// Simpan/Update Metode Pembayaran
app.post('/api/payment-methods/save', async (req, res) => {
    const { id, name, type, account_number, account_name, is_active } = req.body;
    let methods = await kv.get('payment_methods') || defaultMethods;
    
    const index = methods.findIndex(item => item.id === id);
    const newData = { id, name, type, account_number, account_name, is_active: is_active === 'true' };

    if (index !== -1) {
        methods[index] = newData;
    } else {
        methods.push(newData);
    }
    
    await kv.set('payment_methods', methods);
    res.json({ success: true, message: 'Metode pembayaran aman di Vercel KV!' });
});

// ================= API SOSIAL MEDIA REDIRECT =================

// Ambil data sosmed admin
app.get('/api/admin-socials', async (req, res) => {
    let socials = await kv.get('admin_socials');
    if (!socials) {
        await kv.set('admin_socials', defaultSocials);
        socials = defaultSocials;
    }
    res.json(socials);
});

// Simpan data sosmed admin
app.post('/api/admin-socials/save', async (req, res) => {
    const { active_platform, whatsapp_number, whatsapp_message, telegram_username } = req.body;
    const newSocials = { active_platform, whatsapp_number, whatsapp_message, telegram_username };
    
    await kv.set('admin_socials', newSocials);
    res.json({ success: true, message: 'Setting sosmed berhasil diperbarui!' });
});

// Route utama ke admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
