import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { socket } from "../socket/socket";
import { ClientEvents, ServerEvents } from "../socket/events";

interface LobbyCreatedPayload {
  joinCode: string;
}

export function CreateLobby() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLobbyCreated = ({ joinCode }: LobbyCreatedPayload) => {
      navigate(`/lobby/${joinCode}`);
    };

    socket.on(ServerEvents.LOBBY_CREATED, handleLobbyCreated);
    

    return () => {
      socket.off(ServerEvents.LOBBY_CREATED, handleLobbyCreated);
    };
  }, [navigate]);

  const handleCreateLobby = () => {
    socket.emit(ClientEvents.CREATE_LOBBY);
  };

  return(
    <div>
      <button className="create-button" onClick={handleCreateLobby}>
        Create Lobby
      </button>
    </div>
  );
}