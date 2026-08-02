import type { Player } from "../types/Player";

import "../styles/LobbyPlayerCard.css";

interface LobbyPlayerCardProps {
  player?: Player;
}

export default function LobbyPlayerCard({
  player,
}: LobbyPlayerCardProps) {
  return (
    <div className="player-card">
      {player ? (
        <>
          <span>{player.nickname}</span>
          
          {player.isReady && (
            <span>Ready</span>
          )}

          {player.isHost && (
            <span>👑 Host</span>
          )}
        </>
      ) : (
        <span className="empty-player">Waiting for player...</span>
      )}
    </div>
  );
}