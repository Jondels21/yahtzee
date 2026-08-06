import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { ClientEvents, ServerEvents } from "../socket/events";
import { useParams } from "react-router-dom";
import type { Game } from "../types/Game";

import Scorecard from "../components/Scorecard";

import "../styles/GamePage.css";
import DiceContainer from "../components/DiceContainer";


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

  if (!game) {
    return null;
  }

  const currentPlayer = game.players[game.currentPlayerIndex];

  const isMyTurn = currentPlayer.id === socket.id;

  const handleDiceRoll = () => {
    socket.emit(ClientEvents.ROLL_DICE, joinCode);
  }

  const handleDieClick = (dieId: number) => {
    if (!isMyTurn) {
      return;
    }

    if (game.rollsRemaining === 3 || game.rollsRemaining === 0) {
    return;
    }
    
    socket.emit(ClientEvents.TOGGLE_DIE, joinCode, dieId);
  };

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
          <p>Current turn: {currentPlayer.nickname}</p>
          <DiceContainer dice={game.dice} rollsRemaining={game.rollsRemaining} isMyTurn={isMyTurn} onDieClick={handleDieClick}/>
          <button disabled={!isMyTurn || game.rollsRemaining === 0} onClick={handleDiceRoll}>ROLL DICE</button>
        </div>
        <div className="score-area">
          <Scorecard players={game.players} maxPlayers={game.players.length} />
        </div>
      </main>
    </>
  );
  
}