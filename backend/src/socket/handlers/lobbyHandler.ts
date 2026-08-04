import { Server, Socket } from "socket.io";
import { LobbyManager } from "../../lobby/LobbyManager.js";
import { ClientEvents, ServerEvents } from "../events.js";
import { generateLobbyCode } from "../../utils/generateLobbyCode.js";
import { Player } from "../../player/Player.js";

export function registerLobbyEvents(
    socket: Socket,
    io: Server,
    lobbyManager: LobbyManager
) {

    socket.on(ClientEvents.CREATE_LOBBY, () => {
        
        let joinCode = generateLobbyCode();
        while (lobbyManager.lobbyExists(joinCode)) {
            joinCode = generateLobbyCode();
        }

        lobbyManager.createLobby(joinCode);

        socket.join(joinCode)
        console.log(`CREATE_LOBBY, Room created with ID: ${joinCode}`);

        socket.emit(ServerEvents.LOBBY_CREATED, {
            joinCode,
        });
    });

    socket.on(ClientEvents.JOIN_LOBBY, (joinCode) => {

        const lobby = lobbyManager.getLobby(joinCode);

        if (!lobby) {
            socket.emit(ServerEvents.ERROR, "lobby not found");
            return;
        }
        if (lobby.isFull()) {
            socket.emit(ServerEvents.ERROR, "lobby is full");
            return;
        }

        if (lobby.status !== 0) {
            socket.emit(ServerEvents.ERROR, "Game has already started");
            return;
        }

        socket.join(joinCode)
        console.log(`JOIN_LOBBY, User ${socket.id} joined lobby ${joinCode}`);

        socket.emit(ServerEvents.LOBBY_JOINED, {joinCode});
    });

    socket.on(ClientEvents.LEAVE_LOBBY, (joinCode) => {
        
        const lobby = lobbyManager.getLobby(joinCode);

        if (!lobby) {
            socket.emit(ServerEvents.ERROR, "Lobby not found");
            return;
        }

        const removed = lobby.removePlayer(socket.id);

        if (!removed) {
            socket.emit(ServerEvents.ERROR, "Player not found in lobby");
            return;
        }

        console.log(`LEAVE_LOBBY, Player ${socket.id} left lobby ${joinCode}`);
        
        socket.leave(joinCode);

        if (lobby.isEmpty()) {
            lobbyManager.deleteLobby(joinCode);
            console.log(`Deleted lobby ${joinCode}`);
            return;
        }

        io.to(joinCode).emit(ServerEvents.LOBBY_UPDATED, lobby);
    });

    socket.on(ClientEvents.SET_NICKNAME, (joinCode, nickname) => {

        const lobby = lobbyManager.getLobby(joinCode);
        if (!lobby) {
            socket.emit(ServerEvents.ERROR, "lobby not found");
            console.log("Lobby not found");
            return;
        }

        const normalizedNickname = nickname.trim();

        if (normalizedNickname.length === 0 || normalizedNickname.length > 20) {
            socket.emit(ServerEvents.ERROR, "Nickname must be between 1 and 20 characters.");
            return;
        };

        const player = new Player(socket.id, normalizedNickname);

        let added = lobby.addPlayer(player);

        if (added) {
            socket.emit(ServerEvents.NICKNAME_ACCEPTED);
            io.to(joinCode).emit(ServerEvents.LOBBY_UPDATED, lobby);
            console.log(`SET_NICKNAME, ${normalizedNickname} joined ${joinCode}`);
        } else {
            socket.emit(ServerEvents.ERROR, "Failed to add player");
            console.log("Failed to add player");
            return;
        }
        
    });

    socket.on(ClientEvents.PLAYER_READY, (joinCode) => {
        const lobby = lobbyManager.getLobby(joinCode);
        if (!lobby) {
            socket.emit(ServerEvents.ERROR, "lobby not found");
            console.log("Lobby not found");
            return;
        }

        const player = lobby.getPlayer(socket.id);

        if (!player) {
            socket.emit(ServerEvents.ERROR, "Player not found");
            return;
        }

        player.toggleReady();

        io.to(joinCode).emit(ServerEvents.LOBBY_UPDATED, lobby);

        console.log(`PLAYER_READY, ${player.nickname} is ${player.isReady ? "ready" : "not ready"}`);

    });

}  