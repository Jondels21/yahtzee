import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { ClientEvents, ServerEvents } from "../socket/events";
import { useNavigate, useParams } from "react-router-dom";
import type { Game } from "../types/Game";

import Scorecard from "../components/Scorecard";

import "../styles/GamePage.css";
import DiceContainer from "../components/DiceContainer";
import type { ScoreCategory } from "../types/ScoreCategory";
import GameOverList from "../components/GameOverList";


export default function GamePage() {

  const { joinCode } = useParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  
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
    setError("");
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

  const handleScoreSelected = (category: ScoreCategory) => {
    // console.log(`Clicked ${category}`);
    socket.emit(ClientEvents.SELECT_SCORE, joinCode, category);
  };

  const handleExitGame = () => {
    socket.emit(ClientEvents.LEAVE_LOBBY, joinCode);
    if(!joinCode) {
      return;
    };
    
    navigate("/");
  };

  if (loading) {
    return <p>Loading...</p>;
  };

  if (game.status === "FINISHED") {
    return (
      <>
        <GameOverList
          players={game.players}
          maxPlayers={game.players.length}
        />
        <div>
          <button className="leave-button" onClick={handleExitGame}>
            EXIT GAME
          </button>
        </div>
      </>
    );
  };



  return (
    <main className="game-container">
      <section className="game-area">
        <div className="game-info">
          <span className={isMyTurn ? "turn-pill active" : "turn-pill"}>
            {isMyTurn ? "Your turn" : "Waiting"}
          </span>

          <div>
            <p className="turn-label">Current player</p>
            <h1 className="turn-player">{currentPlayer.nickname}</h1>
          </div>

          <p className="turn-count">
            Turn <strong>{game.currentTurn}</strong>
          </p>
        </div>

        <DiceContainer
          dice={game.dice}
          rollsRemaining={game.rollsRemaining}
          isMyTurn={isMyTurn}
          onDieClick={handleDieClick}
        />

        <div className="game-actions">
          <button className="roll_button" disabled={!isMyTurn || game.rollsRemaining === 0} onClick={handleDiceRoll}>ROLL DICE</button>
        </div>

        {error && (
          <p className="error">{error}</p>
        )}
      </section>

      <section className="score-area" aria-label="Scorecard">
        <div className="score-area-header">
          <p>Scorecard</p>
          <span>{game.players.length} players</span>
        </div>

        <Scorecard
          players={game.players}
          currentPlayerIndex={game.currentPlayerIndex}
          localPlayerId={socket.id}
          onScoreSelected={handleScoreSelected}
          maxPlayers={game.players.length}
        />
      </section>
    </main>
  );
  
}
