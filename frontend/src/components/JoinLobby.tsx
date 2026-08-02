import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { socket } from "../socket/socket";
import { ClientEvents, ServerEvents } from "../socket/events";

import "../styles/JoinLobby.css"

interface LobbyJoinedPayload {
  joinCode: string;
}

export function JoinLobby() {
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState("");
  const [lobbyError, setLobbyError] = useState("");

  useEffect(() => {
    const handleLobbyJoined = ({ joinCode }: LobbyJoinedPayload) => {

      setLobbyError("");
      navigate(`/lobby/${joinCode}`);
    };

    const handleLobbyError = (message: string) => {
      setLobbyError(message);
    };

    socket.on(ServerEvents.LOBBY_JOINED, handleLobbyJoined);
    socket.on(ServerEvents.ERROR, handleLobbyError);

    return () => {
      socket.off(ServerEvents.LOBBY_UPDATED, handleLobbyJoined);
      socket.off(ServerEvents.ERROR, handleLobbyError);
    };
  }, [navigate]);

  const handleJoinLobby = () => {
    socket.emit(ClientEvents.JOIN_LOBBY, joinCode);
  };
  


  return (
    <>
      <div className="join">
        <button
          className='join-button'
          onClick={handleJoinLobby}
        >
          Join Lobby
        </button>
        {lobbyError && (
          <p className="error">{lobbyError}</p>
        )}
          <div className="field">
            <input className="input-field"
              type="text"
              placeholder="Enter lobby code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </div>
      </div>
    </>
  );
}