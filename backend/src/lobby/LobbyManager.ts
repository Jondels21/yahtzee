import { Lobby } from "./Lobby.js";

export class LobbyManager {
    private readonly lobbies = new Map<string, Lobby>();

    createLobby(joinCode: string): Lobby | undefined {
        const lobby = new Lobby(joinCode);

        this.lobbies.set(joinCode, lobby);

        return lobby;
    }

    getLobby(joinCode: string): Lobby | undefined {
        return this.lobbies.get(joinCode);
    }

    deleteLobby(joinCode: string): void {
        this.lobbies.delete(joinCode);
    }

    lobbyExists(joinCode: string): boolean {
        return this.lobbies.has(joinCode);
    }

    getAllLobbies(): Lobby[] {
        return [...this.lobbies.values()];
    }
}