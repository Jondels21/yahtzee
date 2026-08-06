import { Server, Socket } from "socket.io";
import { GameManager } from "../../game/GameManager.js";
import { ClientEvents, ServerEvents } from "../events.js";
import { Player } from "../../player/Player.js";
import type { LobbyManager } from "../../lobby/LobbyManager.js";
import { LobbyStatus } from "../../lobby/LobbyStatus.js";

export function registerGameEvents(
  socket: Socket,
  io: Server,
  gameManager: GameManager,
  lobbyManager: LobbyManager,
){

  socket.on(ClientEvents.START_GAME, (joinCode) => {
    const lobby = lobbyManager.getLobby(joinCode);
    if (!lobby) {
      socket.emit(ServerEvents.ERROR, "lobby not found");
      console.log("Lobby not found");
      return;
    }

    lobby.setStatus(LobbyStatus.IN_PROGRESS);

    gameManager.createGame(lobby);

    // TODO
    // Validate if sender is the host
    // Validate if everyone is ready
    // Validate has the game already started
    
    io.to(joinCode).emit(ServerEvents.GAME_STARTED);
    console.log(`GAME_STARTED, ${lobby.joinCode} Started`);

  });

  socket.on(ClientEvents.GET_GAME_STATE, (joinCode) => {

    const game = gameManager.getGame(joinCode);
    if (!game) {
      socket.emit(ServerEvents.ERROR, "Game not found");
      return;
    }

    console.log(`GET_GAME_STATE, ${game}`);
    

    socket.emit(ServerEvents.GAME_UPDATED, game);
  });

  socket.on(ClientEvents.ROLL_DICE, (joinCode) => {
    const game = gameManager.getGame(joinCode);
    if (!game) {
      socket.emit(ServerEvents.ERROR, "Game not found");
      return;
    }

    console.log(`ROLL_DICE`);

    if (socket.id === game.players[game.currentPlayerIndex].id) {
        game.rollDice();
        io.to(joinCode).emit(ServerEvents.GAME_UPDATED, game);
    } else {
      socket.emit(ServerEvents.ERROR, "Not your turn");
      return;
    }

  });

  socket.on(ClientEvents.TOGGLE_DIE, (joinCode: string, id: number) => {
    const game = gameManager.getGame(joinCode);
    if (!game) {
      socket.emit(ServerEvents.ERROR, "Game not found");
      return;
    }

    if (socket.id === game.players[game.currentPlayerIndex].id) {
      game.toggleHoldDice(id);
      console.log(`TOGGLE_DIE, Die:${id} toggled`);
      io.to(joinCode).emit(ServerEvents.GAME_UPDATED, game);
    } else {
      socket.emit(ServerEvents.ERROR, "Not your turn");
      return;
    }


  });
}
