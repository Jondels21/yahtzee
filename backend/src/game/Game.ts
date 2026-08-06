import { Player } from "../player/Player.js";
import type { ScoreCategory } from "../types/ScoreCategory.js";
import { Die } from "./Die.js";
import { GameStatus } from "./GameStatus.js";

export class Game {

  public readonly createdAt = new Date();
  public status = GameStatus.PLAYING;
  public dice: Die[];

  constructor(
    public readonly joinCode: string,
    public readonly players: Player[],
    public currentPlayerIndex: number,
    public currentTurn: number,
    public rollsRemaining: number,
  ){
    this.dice = this.createDice();
  }

  createDice(): Die[] {
    return Array.from({ length: 5}, (_, index) => {
      return new Die(index, 1, false);
    });
  }

  rollDice(): void {
    if (this.rollsRemaining === 0) {
      return;
    }

    for (const die of this.dice) {
      if (!die.held) {
        die.value = Math.floor(Math.random() * 6) + 1;
      }
    }

    this.rollsRemaining--;
  }

  toggleHoldDice(id: number): void {
    if (this.rollsRemaining === 3) {
      return;
    }
    
    const die = this.dice.find(die => die.id === id);

    if (!die) {
      return;
    }
    
    die.held = !die.held;
  }

  resetDice(): void {
    for (const die of this.dice) {
      die.held = false;
    }
  }

  nextPlayer(): void {
    this.currentPlayerIndex++;
    this.rollsRemaining = 3;
    this.resetDice();
    if (this.currentPlayerIndex === this.players.length) {
      this.currentPlayerIndex = 0;
    }
  }

  selectScore(category: ScoreCategory, value: number): boolean {
    const player = this.players[this.currentPlayerIndex]!;

    if (player.scores[category] !== null) {
      return false;
    }

    player.scores[category] = value;
    return true;
  }
  
}