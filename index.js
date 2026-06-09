const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data awal (QRIS, DANA, Gopay, SeaBank)
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

// --- ROUTE DIREKTORI UTAMA ---
app.get('/', (req, res) => {
    res.send('<h1>Server Fajrush Payment Aktif!</h1><p>Akses <a href="/admin">/admin</a> untuk masuk ke panel.</p>');
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/invoice', (req, res) => {
    res.sendFile(path.join(__dirname, 'invoice.html'));
});

// --- ROUTE API ---
app.get('/api/payment-methods', (req, res) => { res.json(paymentMethods); });

app.post('/api/payment-methods/save', (req, res) => {
    const { id, name, type, account_number, account_name, is_active } = req.body;
    const index = paymentMethods.findIndex(item => item.id === id);
    const newData = { id, name, type, account_number, account_name, is_active: is_active === 'true' };
    if (index !== -1) paymentMethods[index] = newData; else paymentMethods.push(newData);
    res.json({ success: true, message: 'Metode pembayaran berhasil diperbarui!' });
});

app.get('/api/admin-socials', (req, res) => { res.json(adminSocials); });

app.post('/api/admin-socials/save', (req, res) => {
    const { active_platform, whatsapp_number, whatsapp_message, telegram_username } = req.body;
    adminSocials = { active_platform, whatsapp_number, whatsapp_message, telegram_username };
    res.json({ success: true, message: 'Setting sosmed berhasil diperbarui!' });
});

// Supaya bisa dijalankan local maupun serverless
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Jalan di port 3000'));
}

module.exports = app;
