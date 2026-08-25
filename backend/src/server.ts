import express from 'express';
import cors from "cors";
import "dotenv/config";

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initializeSocket } from './socket/socket.js';

const PORT = 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [
  "http://localhost:5173",
];

console.log(allowedOrigins);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: false,
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

