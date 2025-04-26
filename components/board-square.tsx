import clsx from 'clsx'
import { useRef, useState } from 'react'

import { useBoard } from '@/providers/board-provider'
import { BoardIndex, BoardPosition } from '@/types/board'
import { Piece, PieceNotation } from '@/types/piece'
import { getBoardPosition } from '@/utils/board'
import BoardPiece from './board-piece'
import { parsePieceNotation } from '@/utils/piece'

type Props = {
  pieceNotation: PieceNotation | null
  boardIndex: BoardIndex
  onClick: (piece: Piece | null, position: BoardPosition) => void
}

const BoardSquare = ({
  pieceNotation,
  boardIndex,
  onClick,
}: Props) => {
  const { activePiece, activeColor, setActivePiece, perspective, makeMove } = useBoard()
  const { fileIndex, rankIndex } = boardIndex
  const boardPosition = getBoardPosition(boardIndex, perspective)
  const piece = pieceNotation ? parsePieceNotation(pieceNotation, boardPosition) : null
  const imageRef = useRef<HTMLImageElement | null>(null)
  const translateX = fileIndex * 100
  const translateY = rankIndex * 100
  const [droppable, setDroppable] = useState(false)

  const handleClick = () => {
    if (!piece) {
      onClick(null, boardPosition)
      return
    }

    onClick(piece, boardPosition)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'

    if (!piece) return
    if (piece.color !== activeColor) return

    setActivePiece(piece)

    if (imageRef.current) {
      const dragImage = imageRef.current
      e.dataTransfer.setDragImage(
        dragImage,
        dragImage.width / 2,
        dragImage.height / 2
      )
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()

    if (activePiece?.color !== piece?.color) {
      setDroppable(true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()

    setDroppable(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    makeMove(boardPosition)

    setDroppable(false)
  }

  return (
    <button
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      style={{
        transform: `translate3d(${translateX}%, ${translateY}%, 0)`,
        transition: 'transform 0.2s ease-in-out',
      }}
      className={clsx(
        piece ? 'cursor-grab' : 'cursor-auto',
        droppable ? 'border-4 border-white' : '',
        'absolute top-0 left-0 w-[12.5%] h-[12.5%] touch-none overflow-hidden z-20 will-change-transform transition-transform ease-in-out duration-200'
      )}
    >
      {piece ? <BoardPiece ref={imageRef} piece={piece} /> : null}
    </button>
  )
}

export default BoardSquare
