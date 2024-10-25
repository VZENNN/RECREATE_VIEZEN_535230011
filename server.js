const http = require('http');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menangani pengiriman file HTML
const serveFile = (filePath, contentType, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading the page');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

// Membuat server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

        // Ekstensi file untuk content type
        let extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.ico':
                contentType = 'image/x-icon';
                break;
        }

        // Jika tidak ada ekstensi, asumsikan file adalah .html
        if (!extname) filePath += '.html';

        // Menampilkan file
        serveFile(filePath, contentType, res);

    } else if (req.method === 'POST' && req.url === '/submit') {
        // Untuk menangani form POST dari subscribe.html
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const dataObj = new URLSearchParams(body);
            const nama = dataObj.getElementById('nama');
            const dob = dataObj.getElementById('dob');
            const email = dataObj.getElementById('email');
            const phone = dataObj.getElementById('phone');
            const plan = dataObj.getElementById('plan');

            const dataToSave = `Nama: ${nama}\nTanggal Lahir: ${dob}\nEmail: ${email}\nNo. Telpon: ${phone}\nPlan: ${plan}\n`;

            const filePath = path.join(__dirname, 'subscription.txt');
            fs.appendFile(filePath, dataToSave, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error saat menyimpan data');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write('<h2>Terima kasih, data Anda telah berhasil berlangganan!</h2>');
                    res.write('<button onclick="window.location.href=\'/\'">Kembali ke Form</button>');
                    res.end();
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h2>Halaman tidak ditemukan</h2>');
    }
});

// Menjalankan server pada port 3000
server.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
