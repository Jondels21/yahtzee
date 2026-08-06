import type { Die } from "../types/Die";

import "../styles/DiceContainer.css";


interface DiceContainerProps {
  dice: Die[],
  rollsRemaining: number,
  onDieClick: (dieId: number) => void;
}

export default function DiceContainer({
  dice,
  rollsRemaining,
  onDieClick,
}: DiceContainerProps) {


  return(
    <>
      <p className="remaining">Rolls remaining: {rollsRemaining}</p>
      <div className="diceRow">
        {dice.map((die) => (
          <p key={die.id} className={`die ${die.held ? "held" : ""}`} onClick={() => onDieClick(die.id)}>
            {die.value}
          </p>
        ))}
      </div>
    </>
  );
}