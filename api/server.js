require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

// Serve static files from the "public" directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/docs', express.static(path.join(__dirname, '../public/docs')));

// Endpoint to get list of files in 'publications' and 'reports'
app.get('/api/documents/:type', (req, res) => {
    const docType = req.params.type;
    const docPath = path.join(__dirname, '../public/docs', docType);

    fs.readdir(docPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const fileList = files.map(file => ({
            name: file,
            url: `/docs/${docType}/${file}`,
            type: path.extname(file).toLowerCase() // File extension for icons
        }));
        res.json(fileList);
    });
});

// Endpoint to get image filenames
app.get('/api/images', (req, res) => {
    const galleryDir = path.join(__dirname, '../public/images/gallery');
    fs.readdir(galleryDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Send the list of filenames
        res.json(files);
    });
});

// Export the Express app as a serverless function
module.exports = app;