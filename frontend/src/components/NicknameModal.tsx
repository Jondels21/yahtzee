import { useState } from "react";
import "../styles/NicknameModal.css";


interface NicknameModalProps {
  isOpen: boolean;
  onSubmit: (nickname: string) => void;
  error: string;
}

export default function NicknameModal({
  isOpen,
  onSubmit,
  error,
}: NicknameModalProps) {
  const [nickname, setNickname] = useState("");

  if (!isOpen) {
    return null;
  }


  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO:
    // Validate nickname

      onSubmit(nickname);

  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 id="heading">Choose a nickname</h2>
        <div className="field">
          <input
            className="input-field"
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
            {error && (
            <p className="error">{error}</p>
          )}
        </div>
        <div className="btn">
          <button className="button1" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}