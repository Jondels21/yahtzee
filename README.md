# Project Information

This project is a real-time multiplayer Yahtzee browser game built with TypeScript. Players can create or join game lobbies and play a turn-based game together. The multiplayer functionality is implemented using WebSockets with Socket.IO.

## Features

- Create and join game lobbies using a join code
- Set a player nickname
- Ready system for players
- The host can start the game when all players are ready
- Turn-based dice rolling and scoring
- Players can hold selected dice between rolls
- Real-time game state updates for all connected players
- Server-authoritative game logic

## Technologies

### Frontend

- Vite
- React
- TypeScript
- React Router
- Socket.IO Client
- HTML
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Socket.IO

## Environment Variables

The frontend reads the Socket.IO server URL from the following environment variable:

```env
VITE_API_URL=http://localhost:3000
```

If `VITE_API_URL` is not set, the frontend uses `http://localhost:3000` by default.

## Run Instructions

### Backend

Run the following commands in the `backend` directory:

```bash
npm install
npm run dev
```

### Frontend

Run the following commands in the `frontend` directory:

```bash
npm install
npm run dev
```
