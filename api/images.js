import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const galleryDir = path.join(process.cwd(), 'public/images/gallery');

    fs.readdir(galleryDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        res.status(200).json(files);
    });
}