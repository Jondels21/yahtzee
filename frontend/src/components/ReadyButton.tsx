interface ReadyButtonProps {
  ready: boolean;
  onClick: () => void;
}

export default function ReadyButton({
  ready,
  onClick,
}: ReadyButtonProps) {
  return (
    <button
      className="ready-button"
      onClick={onClick}
    >
      {ready ? "Unready" : "Ready"}
    </button>
  );
}