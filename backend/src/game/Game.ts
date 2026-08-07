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

  calculateScore(category: ScoreCategory): number {
    switch (category) {
      case "Ones":
        return this.calculateOnes();
      case "Twos":
        return this.calculateTwos();
      case "Threes":
        return this.calculateThrees();
      case "Fours":
        return this.calculateFours();
      case "Fives":
        return this.calculateFives();
      case "Sixes":
        return this.calculateSixes();
      case "Pair":
        return this.calculatePair();
      case "TwoPairs":
        return this.calculateTwoPairs();
      case "ThreeOfAKind":
        return this.calculateThreeOfAKind();
      case "FourOfAKind":
        return this.calculateFourOfAKind();
      case "SmallStraight":
        return this.calculateSmallStraight();
      case "LargeStraight":
        return this.calculateLargeStraight();
      case "FullHouse":
        return this.calculateFullHouse();
      case "Chance":
        return this.calculateChance();
      case "Yahtzee":
        return this.calculateYahtzee();
    }
  }

  countOccurences(value: number): number {
    let amount = 0;
    for (const die of this.dice) {
      if (die.value === value) {
        amount++;
      }
    }
    return amount;
  }

  orderDiceByValue(): number[] {
    let sortedDice: number[] = [];
    for (const die of this.dice) {
      sortedDice.push(die.value);
    }
    sortedDice.sort((a, b) => a - b);
    return sortedDice;
  }

  calculateOnes(): number {
    return this.countOccurences(1);
  }

  calculateTwos(): number {
    return this.countOccurences(2) * 2;
  }

  calculateThrees(): number {
    return this.countOccurences(3) * 3;
  }

  calculateFours(): number {
    return this.countOccurences(4) * 4;
  }

  calculateFives(): number {
    return this.countOccurences(5) * 5;
  }

  calculateSixes(): number {
    return this.countOccurences(6) * 6;
  }

  calculatePair(): number {
    for (let i = 6; i >= 1; i--) {
      if (this.countOccurences(i) >= 2) {
        return i * 2;
      }
    }
    return 0;
  }

  calculateTwoPairs(): number {
    for (let i = 6; i >= 1; i--) {
      if (this.countOccurences(i) >= 2) {
        const firstPair = i * 2;
        for (let x = i - 1; x >= 1; x--) {
          if(this.countOccurences(x) >= 2) {
            const secondPair = x * 2;
            return firstPair + secondPair;
          }
        }
      }
    }
    return 0;
  }

  calculateThreeOfAKind(): number {
    for (let i = 6; i >= 1; i--) {
      if (this.countOccurences(i) >= 3) {
        return i * 3;
      }
    }
    return 0;
  }

  calculateFourOfAKind(): number {
    for (let i = 6; i >= 1; i--) {
      if (this.countOccurences(i) >= 4) {
        return i* 4;
      }
    }
    return 0;
  }

  calculateSmallStraight(): number {
    const smallStraight = [1,2,3,4,5];
    const sortedDice = this.orderDiceByValue();
    if (sortedDice.every((value, index) => value === smallStraight[index])) {
      return 15;
    }
    return 0;
  }

  calculateLargeStraight(): number {
    const LargeStraight = [2,3,4,5,6];
    const sortedDice = this.orderDiceByValue();
    if (sortedDice.every((value, index) => value === LargeStraight[index])) {
      return 20;
    }
    return 0;
  }

  calculateFullHouse(): number {
    for (let i = 1; i <= 6; i++) {
      if (this.countOccurences(i) === 2) {
        const pair = i * 2;
        for (let x = 1; x <= 6; x++) {
          if (this.countOccurences(x) === 3) {
            const triplets = x * 3;
            return pair + triplets;
          }
        }
      }
    }
    return 0;
  }

  calculateChance(): number {
    let score = 0;
    for (const die of this.dice) {
      score += die.value;
    }
    return score;
  }

  calculateYahtzee(): number {
    let ref = this.dice[0]!.value;
    for (const die of this.dice) {
      if (die.value !== ref) {
        return 0;
      }
    }
    return 50;
  }
}