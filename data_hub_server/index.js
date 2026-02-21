const express = require('express');
const { Server, EVENTS } = require('@tus/server');
const { FileStore } = require('@tus/file-store');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const port = 1080;
const uploadDir = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 1. Setup Tus Server
const tusServer = new Server({
    path: '/files', // This MUST match the route prefix below
    datastore: new FileStore({
        directory: uploadDir,
    }),
    // relativeLocation: false ensures Tus returns absolute URLs including the prefix
    relativeLocation: false,
    namingFunction: (req, metadata) => {
        const id = crypto.randomBytes(16).toString('hex');
        if (metadata && metadata.filename) {
            // Replace non-alphanumeric characters in filename for safety, preserving dots
            const safeName = metadata.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
            return `${id}_${safeName}`;
        }
        return id;
    }
});

// 2. Global CORS Configuration
// We apply this BEFORE the routes so it catches both successful and 404/500 responses
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 
        'Tus-Resumable', 'Upload-Length', 'Upload-Offset', 'Upload-Metadata', 'Upload-Concat'
    ],
    exposedHeaders: [
        'Location', 'Tus-Resumable', 'Upload-Offset', 'Upload-Length', 'Content-Length'
    ]
}));

// 3. The Route (Express 5.x Fix)
app.all('/files', (req, res) => {
    tusServer.handle(req, res);
});
app.all('/files/:id', (req, res) => {
    tusServer.handle(req, res);
});


// 4. Root route for health check
app.get('/', (req, res) => {
    res.send('Tus Server is running at /files');
});

// 5. Fallback 404 handler to ensure CORS headers are still sent
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
    console.log(`Uploads directed to: ${uploadDir}`);
});