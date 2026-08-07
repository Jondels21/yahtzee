import type { Scores } from "./Scores";

export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  scores: Scores;
  upperTotal: number,
  lowerTotal: number,
  bonus: number,
  grandTotal: number,
}