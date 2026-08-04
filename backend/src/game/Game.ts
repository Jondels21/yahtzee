import { Player } from "../player/Player.js";

export class Game {

  constructor(
    public readonly joinCode: string,
    public readonly players: Player[],
    public currentTurn = 0,
  ){}

  
}