import type { Player } from "../types/Player";

import "../styles/GameOverList.css";

interface GameOverListProps {
  players: Player[];
  maxPlayers: number;
}

export default function GameOverList({
  players,
  maxPlayers,
}: GameOverListProps) {

  const sortedPlayers = [...players];

  sortedPlayers.sort((a, b) => b.grandTotal - a.grandTotal);


  return (
    <section className="section">
      <h2>Game over!</h2>
      <div className="player-container">
        {Array.from({ length: maxPlayers}, (_, index) => {
          const player = sortedPlayers[index];

          return (
            <div 
              className={`results-player-card ${index === 0 ? "winner" : ""}`}
              key={player.nickname}
            >
              <span className="player-position">{index + 1}</span>
              
              <span className="player-name">{player.nickname}</span>

              <span className="player-score">{player.grandTotal}</span>

              {index === 0 && (<span className="winner-label">👑 Winner</span>)}

            </div>
          );
        })}
      </div>
    </section>
  );
}