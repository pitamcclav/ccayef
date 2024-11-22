import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { type } = req.query; // Use query parameters for dynamic routing
    const docPath = path.join(process.cwd(), 'docs', type);

    fs.readdir(docPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        const fileList = files.map(file => ({
            name: file,
            url: `/docs/${type}/${file}`,
            type: path.extname(file).toLowerCase()
        }));
        res.status(200).json(fileList);
    });
}