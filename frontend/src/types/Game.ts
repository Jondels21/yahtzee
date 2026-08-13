import type { Player } from "./Player";
import type { Die } from "./Die";
import type { GameStatus } from "./GameStatus";

export interface Game {
  joinCode: string;
  players: Player[];
  currentPlayerIndex: number;
  currentTurn: number;
  rollsRemaining: number;
  dice: Die[];
  status: GameStatus;
}