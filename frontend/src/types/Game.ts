import type { Player } from "./Player";
import type { Die } from "./Die";

export interface Game {
  joinCode: string;
  players: Player[];
  currentTurn: number;
  rollsRemaining: number;
  dice: Die[];
}