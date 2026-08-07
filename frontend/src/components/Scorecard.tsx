import type { Player } from "../types/Player";
import ScoreCell from "./ScoreCell";

import "../styles/Scorecard.css";
import type { ScoreCategory } from "../types/ScoreCategory";

interface ScorecardProps {
  players: Player[],
  currentPlayerIndex: number,
  localPlayerId: string | undefined,
  maxPlayers: number,
  onScoreSelected: (category: ScoreCategory) => void;
}

const upperCategories: ScoreCategory[] = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
];

const lowerCategories: ScoreCategory[] = [
  "Pair",
  "TwoPairs",
  "ThreeOfAKind",
  "FourOfAKind",
  "SmallStraight",
  "LargeStraight",
  "FullHouse",
  "Chance",
  "Yahtzee",
];

const categoryLabels: Record<ScoreCategory, string> = {
  Ones: "Ones",
  Twos: "Twos",
  Threes: "Threes",
  Fours: "Fours",
  Fives: "Fives",
  Sixes: "Sixes",
  Pair: "Pair",
  TwoPairs: "Two Pairs",
  ThreeOfAKind: "Three of a Kind",
  FourOfAKind: "Four of a Kind",
  SmallStraight: "Small Straight",
  LargeStraight: "Large Straight",
  FullHouse: "Full House",
  Chance: "Chance",
  Yahtzee: "Yahtzee",
};

export default function Scorecard({
  players,
  currentPlayerIndex,
  localPlayerId,
  maxPlayers,
  onScoreSelected,
}: ScorecardProps) {

  const currentPlayerId = players[currentPlayerIndex].id;

  const renderCategoryRows = (categories: ScoreCategory[]) => 
    categories.map((category) => (
      <tr key={category}>
        <th scope="row">{categoryLabels[category]}</th>
          {players.map((player) => {
            const clickable =
              player.id === localPlayerId &&
              player.id === currentPlayerId &&
              player.scores[category] === null;
            return (
              <ScoreCell
                key={player.id}
                value={player.scores[category]}
                category={category}
                clickable={clickable}
                onClick={onScoreSelected}
              />
            );
          })}
      </tr>
    ));


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
        {renderCategoryRows(upperCategories)}
        <tr className="separator">
          <th scope="row">Upper total</th>
            {players.map((player) => (
              <td key={player.id}>
                {player.upperTotal}
              </td>
            ))}
        </tr>
        <tr className="separator">
          <th scope="row">Bonus</th>
            {players.map((player) => (
              <td key={player.id}>
                {player.bonus}
              </td>
            ))}
        </tr>
        {renderCategoryRows(lowerCategories)}
        <tr className="separator">
          <th scope="row">Grand total</th>
            {players.map((player) => (
              <td key={player.id}>
                {player.grandTotal}
              </td>
            ))}
        </tr>
      </tbody>
    </table>
  );
}