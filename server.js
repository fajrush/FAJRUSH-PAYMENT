const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data awal (Gopay, DANA, SeaBank, QRIS)
let paymentMethods = [
    { id: 'qris', name: 'QRIS All Payment', type: 'QRIS', account_number: 'https://link-qris.com/qris.jpg', account_name: 'Toko Fajrush', is_active: true },
    { id: 'dana', name: 'DANA', type: 'E-Wallet', account_number: '081234567890', account_name: 'Fajrush', is_active: true },
    { id: 'gopay', name: 'Gopay', type: 'E-Wallet', account_number: '081234567890', account_name: 'Fajrush', is_active: true },
    { id: 'seabank', name: 'SeaBank', type: 'Bank', account_number: '90123456789', account_name: 'Fajrush', is_active: true }
];

let adminSocials = {
    active_platform: 'whatsapp',
    whatsapp_number: '6281234567890',
    whatsapp_message: 'Halo bos, saya sudah transfer.',
    telegram_username: 'fajrush_admin'
};

// --- ROUTE UNTUK MENAMPILKAN HALAMAN WEB ---

// Membuka Admin Panel (Langsung ambil file admin.html di root)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Membuka Invoice Pembeli (Langsung ambil file invoice.html di root)
app.get('/invoice', (req, res) => {
    res.sendFile(path.join(__dirname, 'invoice.html'));
});


// --- ROUTE API UNTUK ADMIN PANEL ---

// API Ambil Metode Pembayaran
app.get('/api/payment-methods', (req, res) => {
    res.json(paymentMethods);
});

// API Simpan Metode Pembayaran
app.post('/api/payment-methods/save', (req, res) => {
    const { id, name, type, account_number, account_name, is_active } = req.body;
    const index = paymentMethods.findIndex(item => item.id === id);
    const newData = { id, name, type, account_number, account_name, is_active: is_active === 'true' };

    if (index !== -1) { paymentMethods[index] = newData; } 
    else { paymentMethods.push(newData); }
    res.json({ success: true, message: 'Metode pembayaran berhasil diperbarui!' });
});

// API Ambil Sosmed Admin
app.get('/api/admin-socials', (req, res) => {
    res.json(adminSocials);
});

// API Simpan Sosmed Admin
app.post('/api/admin-socials/save', (req, res) => {
    const { active_platform, whatsapp_number, whatsapp_message, telegram_username } = req.body;
    adminSocials = { active_platform, whatsapp_number, whatsapp_message, telegram_username };
    res.json({ success: true, message: 'Setting sosmed berhasil diperbarui!' });
});

app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
