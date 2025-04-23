import { PiecePosition, Piece, PieceColor } from "@/types/piece"
import ChessPiece from "./piece"
import { getTranslatedPosition } from "@/utils/board"
import clsx from "clsx"

type Props = {
  piece: Piece | null
  perspective: PieceColor
  position: PiecePosition
  onClick: (piece: Piece | null, position: PiecePosition) => void
  onDragStart: (e: React.DragEvent, piece: Piece) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, position: PiecePosition) => void
}

const BoardSquare = ({ piece, perspective, position, onClick, onDragStart, onDragOver, onDrop }: Props) => {
  const { file, rank } = getTranslatedPosition(position, perspective)
  const translateX = file * 100
  const translateY = rank * 100

  const handleClick = () => {
    if (!piece) {
      onClick(null, position)
      return
    }

    onClick(piece, position)
  }

  return (
    <button
      onClick={handleClick}
      onDragStart={(e) => piece && onDragStart(e, piece)}
      onDrop={(e) => onDrop(e, position)}
      onDragOver={onDragOver}
      style={{
        transform: `translate3d(${translateX}%, ${translateY}%, 0)`,
        transition: 'transform 0.2s ease-in-out'
      }}
      className={
        clsx(
          piece ? 'cursor-grab' : 'cursor-auto',
          'absolute top-0 left-0 w-[12.5%] h-[12.5%] touch-none overflow-hidden z-20 will-change-transform transition-transform ease-in-out duration-200'
        )
      }
    >
      {piece ? (
        <ChessPiece piece={piece} />
      ) : (
        null
      )}
    </button>
  )
}

export default BoardSquare
