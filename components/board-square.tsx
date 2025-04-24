import { PiecePosition, Piece, PieceColor } from "@/types/piece"
import ChessPiece from "./piece"
import { getTranslatedPosition } from "@/utils/board"
import clsx from "clsx"
import { useRef, useState } from "react"
import { useBoard } from "@/providers/board-provider"

type Props = {
  piece: Piece | null
  position: PiecePosition
  onClick: (piece: Piece | null, position: PiecePosition) => void
  onDragStart: (e: React.DragEvent, piece: Piece) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, position: PiecePosition) => void
}

const BoardSquare = ({ piece, position, onClick, onDragStart, onDragOver, onDrop }: Props) => {
  const { activePiece, perspective } = useBoard()
  const { file, rank } = getTranslatedPosition(position, perspective)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const translateX = file * 100
  const translateY = rank * 100
  const [droppable, setDroppable] = useState(false)

  const handleClick = () => {
    if (!piece) {
      onClick(null, position)
      return
    }

    onClick(piece, position)
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!piece) return

    onDragStart(e, piece)

    if (imageRef.current) {
      const dragImage = imageRef.current
      e.dataTransfer.setDragImage(dragImage, dragImage.width / 2, dragImage.height / 2)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()

    if (activePiece?.color !== piece?.color) {
      setDroppable(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()

    setDroppable(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, position)

    setDroppable(false)
  }

  return (
    <button
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      style={{
        transform: `translate3d(${translateX}%, ${translateY}%, 0)`,
        transition: 'transform 0.2s ease-in-out'
      }}
      className={
        clsx(
          piece ? 'cursor-grab' : 'cursor-auto',
          droppable ? 'border-4 border-white' : '',
          'absolute top-0 left-0 w-[12.5%] h-[12.5%] touch-none overflow-hidden z-20 will-change-transform transition-transform ease-in-out duration-200'
        )
      }
    >
      {piece ? (
        <ChessPiece ref={imageRef} piece={piece} />
      ) : (
        null
      )}
    </button>
  )
}

export default BoardSquare
