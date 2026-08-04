import { Server } from "socket.io";
import { LobbyManager } from "../lobby/LobbyManager.js";
import { registerLobbyEvents } from "./handlers/lobbyHandler.js";
import { ServerEvents } from "./events.js";
import { registerGameEvents } from "./handlers/gameHandler.js";
import { GameManager } from "../game/gameManager.js";

export function initializeSocket(io: Server) {
    const lobbyManager = new LobbyManager();
    const gameManager = new GameManager();

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`);

        registerLobbyEvents(socket, io, lobbyManager);
        registerGameEvents(socket, io, gameManager, lobbyManager);

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);

            const lobby = lobbyManager.findLobbyByPlayer(socket.id);

            if (!lobby) {
                return;
            }

            const removed = lobby.removePlayer(socket.id);

            if (!removed) {
                return;
            }
            console.log(`Removed ${socket.id} from lobby ${lobby.joinCode}`);

            if (lobby.isEmpty()) {
                lobbyManager.deleteLobby(lobby.joinCode);
                console.log(`Deleted lobby ${lobby.joinCode}`);
                return;
            }

            io.to(lobby.joinCode).emit(ServerEvents.LOBBY_UPDATED, lobby);
        })
    })
}