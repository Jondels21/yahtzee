import type { Lobby } from "../lobby/Lobby.js";
import { Game } from "./Game.js";

export class GameManager {
  private readonly games = new Map<string, Game>();

  createGame(lobby: Lobby): Game {
    const game = new Game(
      lobby.joinCode,
      lobby.players
    );

    this.games.set(game.joinCode, game);

    return game;

  }

  getGame(joinCode: string): Game | undefined {
    return this.games.get(joinCode);
  }
}