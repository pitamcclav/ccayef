// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');



const app = express();
const PORT = 3000;

app.use(cors());
// Serve static files from the "public" directory
app.use(express.static('images'));
app.use(express.static('docs'));


// Endpoint to get list of files in 'publications' and 'reports'
app.get('/documents/:type', (req, res) => {
    const docType = req.params.type;
    const docPath = path.join(__dirname, 'public/docs', docType);

    fs.readdir(docPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const fileList = files.map(file => ({
            name: file,
            url: `/public/docs/${docType}/${file}`,
            type: path.extname(file).toLowerCase() // File extension for icons
        }));
        res.json(fileList);
        console.log(fileList);
    });
});




// Endpoint to get image filenames
app.get('/images', (req, res) => {
    const galleryDir = path.join(__dirname, 'public/images/gallery');
    fs.readdir(galleryDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Send the list of filenames
        res.json(files);

        console.log(files);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
