import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import NicknameModal from "../components/NicknameModal";
import { socket } from "../socket/socket";
import { ClientEvents, ServerEvents } from "../socket/events";
import type { Lobby } from "../types/Lobby";
import LobbyPlayerList from "../components/LobbyPlayerList";
import LobbyHeader from "../components/LobbyHeader";
import ReadyButton from "../components/ReadyButton";

import "../styles/LobbyPage.css";


export default function LobbyPage() {
  const navigate = useNavigate();
  const { joinCode } = useParams();

  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [lobby, setLobby] = useState<Lobby | null>(null);


  const [nicknameError, setNicknameError] = useState("");


  const handleNicknameSubmit = (nickname: string) => {
    setNicknameError("");

    socket.emit(ClientEvents.SET_NICKNAME, joinCode, nickname);
  };

  const handlePlayerLeave = () => {
    socket.emit(ClientEvents.LEAVE_LOBBY, joinCode);
    if(!joinCode) {
      return;
    };
    
    navigate("/");
  };

  const handlePlayerReady = () => {
    socket.emit(ClientEvents.PLAYER_READY, joinCode);
  };

  const handlePressStart = () => {
    socket.emit(ClientEvents.START_GAME, joinCode);
  };


  useEffect(() => {
    const handleLobbyUpdated = (updatedLobby: Lobby) => {
      console.log("UpdatedLobby: ",updatedLobby);
      setLobby(updatedLobby);
    };

    const handleNicknameAccepted = () => {
      console.log("Nickname accepted!");
      setNicknameError("");
      setShowNicknameModal(false);
    };

    const handleNicknameError = (message: string) => {
      setNicknameError(message);
    };

    const handleGameStarted = () => {
      navigate(`/game/${joinCode}`);
    };


    socket.on(ServerEvents.LOBBY_UPDATED, handleLobbyUpdated);
    socket.on(ServerEvents.NICKNAME_ACCEPTED, handleNicknameAccepted);
    socket.on(ServerEvents.ERROR, handleNicknameError);
    socket.on(ServerEvents.GAME_STARTED, handleGameStarted);

    return () => {
      socket.off(ServerEvents.LOBBY_UPDATED, handleLobbyUpdated);
      socket.off(ServerEvents.NICKNAME_ACCEPTED, handleNicknameAccepted);
      socket.off(ServerEvents.GAME_STARTED, handleGameStarted);
      socket.off(ServerEvents.ERROR, handleNicknameError);
    };
  }, [navigate, joinCode]);

    if (!joinCode) {
      return <p>Lobby not found</p>
    };

  const currentPlayer = lobby?.players.find((player) => player.id === socket.id);

  return (
      <>
        <NicknameModal
          isOpen={showNicknameModal}
          onSubmit={handleNicknameSubmit}
          error={nicknameError}
        />

        {!showNicknameModal && lobby && (
          <main className="lobby-container">
            <div className="lobby-card">

              <LobbyHeader
                joinCode={joinCode}
                onLeave={handlePlayerLeave}
              />

              <LobbyPlayerList
                players={lobby.players}
                maxPlayers={lobby.maxPlayers}
              />

              <ReadyButton
                ready={currentPlayer?.isReady ?? false}
                onClick={handlePlayerReady}
              />
              
              <button onClick={handlePressStart}>Start game</button>
            </div>
          </main>

        )}
      </>
    );
}