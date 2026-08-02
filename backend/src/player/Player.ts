export class Player {
  constructor(
    public readonly id: string,
    public nickname: string,
    public isHost = false,
    public isReady = false,
    public isConnected = true,
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