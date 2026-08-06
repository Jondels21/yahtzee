import type { ScoreCategory } from "../types/ScoreCategory";

interface ScoreCellprops {
  value: number | null;
  category: ScoreCategory;
  clickable: boolean;
  onClick: (category: ScoreCategory) => void;
}

export default function ScoreCell({
  value,
  category,
  clickable,
  onClick,
}: ScoreCellprops) {
  return (
    <td
      className={clickable ? "score-cell clickable" : "score-cell"}
      onClick={clickable ? () => onClick(category) : undefined}
    >
      {value ?? "-"}
    </td>
  );
}