import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { ClientEvents, ServerEvents } from "../socket/events";
import { useParams } from "react-router-dom";
import type { Game } from "../types/Game";

import Scorecard from "../components/Scorecard";

import "../styles/GamePage.css";


export default function GamePage() {

  const { joinCode } = useParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!joinCode) {
      return;
    }

    const handleGameUpdated = (updatedGame: Game) => {
      setGame(updatedGame);
      setLoading(false);
    };

    const handleError = (message: string) => {
      setError(message);
      setLoading(false);
    };

    socket.on(ServerEvents.GAME_UPDATED, handleGameUpdated);
    socket.on(ServerEvents.ERROR, handleError);


    socket.emit(ClientEvents.GET_GAME_STATE, joinCode);

    return () => {
      socket.off(ServerEvents.GAME_UPDATED, handleGameUpdated);
      socket.off(ServerEvents.ERROR, handleError);
    }

  }, [joinCode]);

  if (loading) {
    return <p>Loading...</p>;
  };

  if (error) {
    return <p className="error">{error}</p>;
  };

  return (
    <>
      <main className="game-container">
        <div className="game-area">
          <h1>Game</h1>
        </div>
        <div className="score-area">
          <Scorecard players={game!.players} maxPlayers={4} />
        </div>
      </main>
    </>
  );
  
}