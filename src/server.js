const http = require('http');
const { MongoClient } = require('mongodb');

const app = require('./app');

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

async function startServer() {
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    })
}

startServer();