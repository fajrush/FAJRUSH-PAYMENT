// Tambahkan data default Sosial Media Admin
let adminSocials = {
    active_platform: 'whatsapp', // Pilihan: 'whatsapp' atau 'telegram'
    whatsapp_number: '6281234567890',
    whatsapp_message: 'Halo Admin, saya sudah transfer untuk invoice tersebut. Tolong diproses ya!',
    telegram_username: 'AdminTokoBot'
};

// API: Ambil data sosial media admin
app.get('/api/admin-socials', (req, res) => {
    res.json(adminSocials);
});

// API: Update data sosial media dari Admin Panel
app.post('/api/admin-socials/save', (req, res) => {
    const { active_platform, whatsapp_number, whatsapp_message, telegram_username } = req.body;
    
    adminSocials = {
        active_platform,
        whatsapp_number,
        whatsapp_message,
        telegram_username
    };
    
    res.json({ success: true, message: 'Setting Pengalihan Sosmed berhasil disimpan!' });
});

// API: Cek status invoice (Digunakan oleh halaman invoice pembeli untuk auto-redirect)
app.get('/api/invoice-status/:id', (req, res) => {
    const invId = req.params.id;
    const tx = transactions.find(t => t.id === invId);
    
    if (!tx) {
        return res.status(404).json({ error: 'Invoice tidak ditemukan' });
    }

    // Jika sudah lunas, berikan data redirect-nya
    let redirectUrl = '';
    if (tx.status === 'PAID') {
        if (adminSocials.active_platform === 'whatsapp') {
            const encodedMsg = encodeURIComponent(adminSocials.whatsapp_message + ` (ID: ${invId})`);
            redirectUrl = `https://wa.me/${adminSocials.whatsapp_number}?text=${encodedMsg}`;
        } else if (adminSocials.active_platform === 'telegram') {
            redirectUrl = `https://t.me/${adminSocials.telegram_username}`;
        }
    }

    res.json({ status: tx.status, redirectUrl });
});
