import type { Scores } from "../types/Scores.js";
export class Player {


  constructor(
    public readonly id: string,
    public nickname: string,
    public isHost = false,
    public isReady = false,
    public isConnected = true,
    public scores: Scores = {
      Ones: null,
      Twos: null,
      Threes: null,
      Fours: null,
      Fives: null,
      Sixes: null,
      Pair: null,
      TwoPairs: null,
      ThreeOfAKind: null,
      FourOfAKind: null,
      SmallStraight: null,
      LargeStraight: null,
      FullHouse: null,
      Chance: null,
      Yahtzee: null,
    }
  ) {}

  becomeHost() {
    this.isHost = true;
  }

  removehost() {
    this.isHost = false;
  }

  toggleReady(): void {
    this.isReady = !this.isReady;
  }

  disconnect() {
    this.isConnected = false;
  }

  reconnect() {
    this.isConnected = true;
  }
}