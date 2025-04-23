import { PieceColor } from "@/types/piece"
import clsx from "clsx"

type Props = {
  perspective: PieceColor
}

const baseRanks = [8, 7, 6, 5, 4, 3, 2, 1]
const baseFiles = ["a", "b", "c", "d", "e", "f", "g", "h"]

const BoardCoordinate = ({ perspective }: Props) => {
  const ranks = perspective === 'white' ? baseRanks : [...baseRanks].reverse()
  const files = perspective === 'white' ? baseFiles : [...baseFiles].reverse()

  return (
    <svg viewBox="0 0 100 100" className="coordinates absolute top-0 left-0">
      {ranks.map((rank, i) => (
        <text key={`rank-${rank}`} x="0.75" y={i * 12.5 + 3.25} fontSize={2.8}
          className={clsx(i % 2 == 0 ? 'fill-[#739552]' : 'fill-[#EBECD0]', 'font-semibold')}>{rank}</text>
      ))}
      {files.map((file, i) => (
        <text key={`file-${file}`} x={i * 12.5 + 10} y="99" fontSize={2.8}
          className={clsx(i % 2 == 0 ? 'fill-[#EBECD0]' : 'fill-[#739552]', 'font-semibold')}>{file}</text>
      ))}
    </svg>
  )
}

export default BoardCoordinate
