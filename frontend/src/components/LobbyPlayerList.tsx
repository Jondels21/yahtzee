import LobbyPlayerCard from "./LobbyPlayerCard";
import type { Player } from "../types/Player";

interface LobbyPlayerListProps {
  players: Player[];
  maxPlayers: number;
}

export default function LobbyPlayerList({
  players,
  maxPlayers,
}: LobbyPlayerListProps) {
  return (
    <section className="players-section">
      <h2>
        Players ({players.length}/{maxPlayers})
      </h2>

      <div className="players-grid">
        {Array.from({ length: maxPlayers }, (_, index) => {
          const player = players[index];

          return (
            <LobbyPlayerCard
              key={index}
              player={player}
            />
          );
        })}
      </div>
    </section>
  );
}