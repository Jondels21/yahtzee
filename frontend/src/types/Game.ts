import type { Player } from "./Player";

export interface Game {
  joinCode: string;
  players: Player[];
  currentTurn: number;
}