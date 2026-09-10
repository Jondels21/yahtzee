import { Server, Socket } from "socket.io";
import { ClientEvents, ServerEvents } from "../events.js";
import type { GameManager } from "../../game/gameManager.js";
import type { LobbyManager } from "../../lobby/LobbyManager.js";
import { LobbyStatus } from "../../lobby/LobbyStatus.js";
import type { ScoreCategory } from "../../types/ScoreCategory.js";
import { GameStatus } from "../../game/GameStatus.js";

export function registerGameEvents(
  socket: Socket,
  io: Server,
  gameManager: GameManager,
  lobbyManager: LobbyManager,
){

  socket.on(ClientEvents.START_GAME, (joinCode: string) => {
    const lobby = lobbyManager.getLobby(joinCode);
    if (!lobby) {
      socket.emit(ServerEvents.ERROR, "lobby not found");
      // console.log("Lobby not found");
      return;
    }

    const player = lobby.getPlayer(socket.id);
    if (!player?.isHost) {
      socket.emit(ServerEvents.ERROR, "Only the host can start the game.");
      return;
    }

    if (lobby.status !== LobbyStatus.WAITING) {
      socket.emit(ServerEvents.ERROR, "Game has already started.");
      return;
    }

    if (!lobby.players.every((player) => player.isReady)) {
      socket.emit(ServerEvents.ERROR, "All players must be ready.");
      return;
    }

    lobby.setStatus(LobbyStatus.IN_PROGRESS);

    gameManager.createGame(lobby);
    
    io.to(joinCode).emit(ServerEvents.GAME_STARTED);
    // console.log(`GAME_STARTED, ${lobby.joinCode} Started`);

  });

  socket.on(ClientEvents.GET_GAME_STATE, (joinCode: string) => {

    const game = gameManager.getGame(joinCode);
    if (!game) {
      socket.emit(ServerEvents.ERROR, "Game not found");
      return;
    }

    // console.log(`GET_GAME_STATE, ${game}`);
    

    socket.emit(ServerEvents.GAME_UPDATED, game.getGameState());
  });

  socket.on(ClientEvents.ROLL_DICE, (joinCode: string) => {
    const game = gameManager.getGame(joinCode);
    if (!game) {
      socket.emit(ServerEvents.ERROR, "Game not found");
      return;
    }

    // console.log(`ROLL_DICE`);

    if (socket.id === game.players[game.currentPlayerIndex]?.id) {
        game.rollDice();
        io.to(joinCode).emit(ServerEvents.GAME_UPDATED, game.getGameState());
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

    if (socket.id === game.players[game.currentPlayerIndex]?.id) {
      game.toggleHoldDice(id);
      // console.log(`TOGGLE_DIE, Die:${id} toggled`);
      io.to(joinCode).emit(ServerEvents.GAME_UPDATED, game.getGameState());
    } else {
      socket.emit(ServerEvents.ERROR, "Not your turn");
      return;
    }

  });

  socket.on(ClientEvents.SELECT_SCORE, (joinCode: string, category: ScoreCategory) => {
    const game = gameManager.getGame(joinCode);
    if (!game) {
      socket.emit(ServerEvents.ERROR, "Game not found");
      return;
    }

    if (socket.id !== game.players[game.currentPlayerIndex]?.id) {
      socket.emit(ServerEvents.ERROR, "Not your turn");
      return;
    }

    if (game.rollsRemaining === 3) {
      socket.emit(ServerEvents.ERROR, "Roll the dice first");
      return;
    }

    // console.log(`SELECT_SCORE, ${category} set`);

    const score = game.calculateScore(category);

    if (!game.selectScore(category, score)) {
      socket.emit(ServerEvents.ERROR, "Category already used");
      return;
    }

    const finished = game.isGameFinished();

    if (!finished) {
      game.nextPlayer();
    } else {
      game.status = GameStatus.FINISHED;
    }

    io.to(joinCode).emit(ServerEvents.GAME_UPDATED, game.getGameState());
  });
}
