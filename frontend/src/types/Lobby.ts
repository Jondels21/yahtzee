import type { Player } from "./Player";

export interface Lobby {
  joinCode: string;
  maxPlayers: number;
  players: Player[];
  status: number;
  createdAt: string;
}