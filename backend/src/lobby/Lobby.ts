import { Player } from "../player/Player.js";
import { LobbyStatus } from "./LobbyStatus.js";

export class Lobby {
    public readonly players: Player[] = [];
    public status = LobbyStatus.WAITING;
    public readonly createdAt = new Date();

    constructor(
        public readonly joinCode: string,
        public readonly maxPlayers: number = 4,
    ){}

    addPlayer(player: Player): boolean {
        if(this.isFull()) {
            return false;
        }
        if (this.getPlayer(player.id)) {
            return false;
        }
        if(this.isEmpty()) {
            player.becomeHost();
        }

        this.players.push(player);

        return true;
    }

    removePlayer(playerId: string): boolean {
        const index = this.players.findIndex(player => player.id === playerId);
        
        if (index === -1) {
            return false;
        }

        const player = this.players[index];

        this.players.splice(index, 1);

        if (player?.isHost) {
            this.assignNewHost();
        }

        return true;
    }

    getPlayer(playerId: string): Player | undefined {
        return this.players.find(player => player.id === playerId);
    }

    getHost(): Player | undefined {
        return this.players.find(player => player.isHost);
    }

    assignNewHost(): void {
        if (this.players.length === 0) {
            return;
        }

        if (this.getHost()) {
            return;
        }

        this.players[0]?.becomeHost();
    }

    isFull(): boolean {
        return this.players.length >= this.maxPlayers;
    }

    isEmpty(): boolean {
        return this.players.length === 0;
    }

}