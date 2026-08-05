import type { Player } from "../types/Player";

import "../styles/Scorecard.css";

interface ScorecardProps {
  players: Player[],
  maxPlayers: number,
}

const upperCategories = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
];

const lowerCategories = [
  "Three of a Kind",
  "Four of a Kind",
  "Full House",
  "Small Straight",
  "Large Straight",
  "Chance",
  "Yahtzee",
];

export default function Scorecard({
  players,
  maxPlayers,
}: ScorecardProps) {

  const renderEmptyCells = () => (
    Array.from({length: maxPlayers }, (_, index) => (
      <td key={index}>-</td>
    ))
  );

  return(
    <table className="scorecard">
      <thead>
        <tr>
          <th scope="col">Category</th>

          {Array.from({ length: maxPlayers }, (_, index) => {
            const player = players[index];

            return (
              <th scope="col" key={index}>
                {player ? player.nickname : "Empty"}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {upperCategories.map((category) => (
          <tr key={category}>
            <th scope="row">{category}</th>
              {renderEmptyCells()}
          </tr>
        ))}
        <tr className="separator">
          <th scope="row">Upper total</th>
            {renderEmptyCells()}
        </tr>
        <tr className="separator">
          <th scope="row">Bonus</th>
            {renderEmptyCells()}
        </tr>
        {lowerCategories.map((category) => (
          <tr key={category}>
            <th scope="row">{category}</th>
              {renderEmptyCells()}
          </tr>
        ))}
        <tr className="separator">
          <th scope="row">Grand total</th>
            {renderEmptyCells()}
        </tr>
      </tbody>
    </table>
  );
}