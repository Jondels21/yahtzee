import "../styles/LobbyHeader.css";

interface LobbyHeaderProps {
  joinCode: string;
  onLeave: () => void;
}

export default function LobbyHeader({
  joinCode,
  onLeave,
}: LobbyHeaderProps) {
  return (
    <header className="lobby-header">
      <div>
        <h1>Lobby</h1>
        <p className="join-code">Code: {joinCode}</p>
      </div>

      <button
        className="leave-button"
        onClick={onLeave}
      >
        Leave Lobby
      </button>
    </header>
  );
}