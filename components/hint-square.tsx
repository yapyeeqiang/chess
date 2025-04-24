import { useBoard } from "@/providers/board-provider";
import { BoardPosition } from "@/types/board"
import { getBoardIndex } from "@/utils/board";
import { parsePieceColor } from "@/utils/piece";
import clsx from "clsx";

type Props = {
  position: BoardPosition;
}

const HintSquare = ({ position }: Props) => {
  const { perspective, activePiece, board } = useBoard()
  const { fileIndex, rankIndex } = getBoardIndex(position, perspective)
  const targetSquare = board[rankIndex][fileIndex]
  const isCapture = (activePiece && targetSquare) && activePiece.color !== parsePieceColor(targetSquare)

  return (
    <div
      className={
        clsx(
          isCapture ? 'border-[7.5px] border-black/[0.14]' : 'bg-black/[0.14] p-[4.2%]',
          'absolute top-0 left-0 h-[12.5%] w-[12.5%] rounded-full bg-clip-content box-border'
        )
      }
      style={{
        transform: `translate3d(${fileIndex * 100}%, ${rankIndex * 100}%, 0)`,
      }}
    />
  )
}

export default HintSquare
