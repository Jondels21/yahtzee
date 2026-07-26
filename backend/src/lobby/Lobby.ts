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
        if(this.isEmpty()) {
            player.becomeHost();
        }

        this.players.push(player);

        return true;
    }

    removePlayer(playerId: string): void {
        const index = this.players.findIndex(player => player.id === playerId);

        if (index !== -1) {
            const player = this.players[index];
            this.players.splice(index, 1);

            if (player?.isHost) {
                this.assignNewHost();
            }
        }
    }

    getPlayer(playerId: string): Player | undefined {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i]?.id === playerId) {
                return this.players[i];
            }
        }
        return undefined;
    }

    getHost(): Player | undefined {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i]?.isHost === true) {
                return this.players[i];
            }
        }
        return undefined;

    }

    assignNewHost(): void {
        if (this.players.length > 0) {
            if(this.getHost() != undefined) {
                return
            }
            this.players[0]?.becomeHost();
        }

    }

    isFull(): boolean {
        if (this.players.length === this.maxPlayers) {
            return true;
        } else {
            return false;
        }
    }

    isEmpty(): boolean {
        if (this.players.length === 0) {
            return true;
        } else {
            return false;
        }

    }

}