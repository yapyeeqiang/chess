"use client"

import { parsePieceNotation } from "@/utils/piece"
import { Piece, PiecePosition } from "@/types/piece"
import BoardSquare from "./board-square"
import BoardCoordinate from "./board-coordinate"
import HighlightSquare from "./highlight-square"
import { useBoard } from "@/providers/board-provider"

const ChessBoard = () => {
  const { board, perspective, activePiece, setActivePiece, selectPiece, makeMove } = useBoard()

  const handleSquareClick = (piece: Piece | null, position: PiecePosition) => {
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

  const handleDrop = (e: React.DragEvent, destination: PiecePosition) => {
    e.preventDefault()

    const from: PiecePosition = JSON.parse(e.dataTransfer.getData('application/json'))

    makeMove(destination)
  }

  return (
    <div className="relative">
      <img src="/chess-board.png" className="h-full w-full aspect-square rounded" />

      <BoardCoordinate perspective={perspective} />

      {/* Pieces */}
      {board.map((rank, rankIndex) =>
        rank.map((pieceNotation, fileIndex) => {
          const piecePosition: PiecePosition = {
            file: fileIndex + 1,
            rank: 8 - rankIndex
          }

          const piece = pieceNotation ? parsePieceNotation(pieceNotation, piecePosition) : null

          return (
            <BoardSquare
              key={`${rankIndex}-${fileIndex}`}
              onClick={handleSquareClick}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              piece={piece}
              position={piecePosition}
            />
          )
        })
      )}

      {activePiece && (
        <HighlightSquare position={activePiece.position} perspective={perspective} />
      )}
    </div>
  )
}

export default ChessBoard
