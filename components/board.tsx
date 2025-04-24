'use client'

import { useBoard } from '@/providers/board-provider'
import { BoardPosition } from '@/types/board'
import { Piece } from '@/types/piece'
import { parsePieceNotation } from '@/utils/piece'

import BoardCoordinate from './board-coordinate'
import BoardSquare from './board-square'
import HighlightSquare from './highlight-square'
import HintSquare from './hint-square'

const ChessBoard = () => {
  const {
    board,
    perspective,
    pseudoLegalMoves,
    activePiece,
    setActivePiece,
    selectPiece,
    makeMove,
  } = useBoard()

  const handleSquareClick = (piece: Piece | null, position: BoardPosition) => {
    if (!activePiece) {
      if (!piece) return

      // select a piece
      return selectPiece({ ...piece, position })
    }

    // move or capture
    if (!piece || piece.color !== activePiece.color) return makeMove(position)

    // deselect
    return selectPiece({ ...piece, position })
  }

  const handleDragStart = (e: React.DragEvent, piece: Piece) => {
    setActivePiece(piece)
    e.dataTransfer.setData('application/json', JSON.stringify(piece.position))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, destination: BoardPosition) => {
    e.preventDefault()

    const from: BoardPosition = JSON.parse(
      e.dataTransfer.getData('application/json')
    )

    makeMove(destination)
  }

  return (
    <div className="relative">
      <img
        src="/chess-board.png"
        className="h-full w-full aspect-square rounded"
      />

      <BoardCoordinate perspective={perspective} />

      {/* Pieces */}
      {board.map((rank, rankIndex) =>
        rank.map((pieceNotation, fileIndex) => {
          const position: BoardPosition = {
            file: fileIndex + 1,
            rank: 8 - rankIndex,
          }

          const piece = pieceNotation
            ? parsePieceNotation(pieceNotation, position)
            : null

          return (
            <BoardSquare
              key={`${rankIndex}-${fileIndex}`}
              onClick={handleSquareClick}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              piece={piece}
              position={position}
            />
          )
        })
      )}

      {activePiece && <HighlightSquare position={activePiece.position} />}

      {activePiece &&
        pseudoLegalMoves.length > 0 &&
        pseudoLegalMoves.map((move, index) => (
          <HintSquare key={index} position={move} />
        ))}
    </div>
  )
}

export default ChessBoard
