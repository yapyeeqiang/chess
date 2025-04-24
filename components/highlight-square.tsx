import { BoardPosition } from "@/types/board"
import { getBoardIndex } from "@/utils/board";
import { useBoard } from "@/providers/board-provider";

type Props = {
  position: BoardPosition;
}

const HighlightSquare = ({ position }: Props) => {
  const { perspective } = useBoard()
  const { fileIndex, rankIndex } = getBoardIndex(position, perspective)

  return (
    <div
      className="absolute top-0 left-0 h-[12.5%] w-[12.5%] bg-[#FFFF33] opacity-50 z-10"
      style={{
        transform: `translate3d(${fileIndex * 100}%, ${rankIndex * 100}%, 0)`,
      }}
    />
  )
}

export default HighlightSquare
