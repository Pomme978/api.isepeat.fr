const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');

const devMode = true; // Basculer sur `false` pour le mode production
const portHTTP = 3212;
const portHTTPS = 3213;

const app = express();

// Configuration de Mongoose pour se connecter à MongoDB
const mongoURI = 'mongodb://isepeat:db%40isepeat2024SERT@nov1.novelium.fr:27017/isepeat';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

if (devMode) {
    // En mode développement, on utilise seulement le serveur HTTP
    http.createServer(app).listen(portHTTP, () => {
        console.log(`Server running in development mode on HTTP port ${portHTTP}`);
    });
} else {
    // En mode production, on lance à la fois le serveur HTTP et le serveur HTTPS
    const httpsOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/api.isepeat.fr/privkey.pem', 'utf-8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/api.isepeat.fr/fullchain.pem', 'utf-8')
    };

    http.createServer(app).listen(portHTTP, () => {
        console.log(`HTTP Server running on port ${portHTTP}`);
    });

    https.createServer(httpsOptions, app).listen(portHTTPS, () => {
        console.log(`HTTPS Server running on port ${portHTTPS}`);
    });
}
