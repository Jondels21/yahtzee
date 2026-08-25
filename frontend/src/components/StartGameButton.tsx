import type { Player } from "../types/Player";

import "../styles/StartGameButton.css";

interface StartGameButtonProps {
  players: Player[];
  onClick: () => void;
}

export default function StartGameButton({
  players,
  onClick,
}: StartGameButtonProps) {

  let allPlayersReady = true;

  for (const player of players) {
    if (!player.isReady) {
      allPlayersReady = false;
    }
  }
  return (
    <button
      className={`start-game-button ${!allPlayersReady ? "disabled" : ""}`}
      onClick={onClick}
      disabled={!allPlayersReady}
    >
      Start Game
    </button>
  );
}