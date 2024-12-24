const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
// const http = require('http');
// const initializeSocket = require('./routes/socket');

connectToMongo();
const app = express();
const port = 5000

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/question', require('./routes/questions'));

// Create HTTP server
// const server = http.createServer(app);

// Initialize WebSocket server
// const io = initializeSocket(server);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})