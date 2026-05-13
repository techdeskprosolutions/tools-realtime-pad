import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// In-memory shared text (resets on container restart)
let sharedText = '';

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current text to new client
  socket.emit('init', sharedText);

  // Receive updates from any client
  socket.on('textUpdate', (newText) => {
    sharedText = newText;
    // Broadcast to all OTHER clients only (no echo to sender)
    socket.broadcast.emit('textUpdate', newText);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Real-time pad server running on port ${PORT}`);
});
