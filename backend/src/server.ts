import express from 'express';
import cors from "cors";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initializeSocket } from './socket/socket.js';

const PORT = 3000;

const allowedOrigins = "http://localhost:5173";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(cors({ origin: allowedOrigins }));


app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

