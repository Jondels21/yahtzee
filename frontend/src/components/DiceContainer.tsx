import type { Die } from "../types/Die";

import "../styles/DiceContainer.css";


interface DiceContainerProps {
  dice: Die[],
  rollsRemaining: number,
  isMyTurn: boolean,
  onDieClick: (dieId: number) => void;
}

export default function DiceContainer({
  dice,
  rollsRemaining,
  isMyTurn,
  onDieClick,
}: DiceContainerProps) {


  return(
    <>
      <p className="remaining">Rolls remaining: {rollsRemaining}</p>
      <div className="diceRow">
        {dice.map((die) => (
          <p key={die.id} className={`die ${die.held ? "held" : ""} ${!isMyTurn || rollsRemaining === 3 || rollsRemaining === 0 ? "disabled" : ""}`} onClick={() => onDieClick(die.id)}>
            {die.value}
          </p>
        ))}
      </div>
    </>
  );
}