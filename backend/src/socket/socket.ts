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
        // console.log(`${socket.id} connected`);

        const leavePlayer = (joinCode: string): boolean => {
            const lobby = lobbyManager.getLobby(joinCode);
            if (!lobby || !lobby.removePlayer(socket.id)) {
                return false;
            }

            socket.leave(joinCode);
            const game = gameManager.getGame(joinCode);
            const gameChanged = game?.removePlayer(socket.id);
            if (lobby.isEmpty()) {
                lobbyManager.deleteLobby(joinCode);
                gameManager.deleteGame(joinCode);
            } else {
                io.to(joinCode).emit(ServerEvents.LOBBY_UPDATED, lobby);
                if (game && gameChanged) {
                    io.to(joinCode).emit(ServerEvents.GAME_UPDATED, game.getGameState());
                }
            }
            return true;
        };

        registerLobbyEvents(socket, io, lobbyManager, leavePlayer);
        registerGameEvents(socket, io, gameManager, lobbyManager);

        socket.on("disconnect", () => {
            const lobby = lobbyManager.findLobbyByPlayer(socket.id);
            if (lobby) {
                leavePlayer(lobby.joinCode);
            }
        })
    })
}
