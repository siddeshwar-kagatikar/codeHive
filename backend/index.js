const connectToMongo = require('./db');
const express = require('express');
const http = require('http');
const cors = require('cors');
const initializeSocket = require('./routes/socket'); // Import the WebSocket logic

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/question', require('./routes/questions'));

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
initializeSocket(server);

// Start the server
server.listen(port, () => {
  console.log(`Developing app listening at http://localhost:${port}`);
});
