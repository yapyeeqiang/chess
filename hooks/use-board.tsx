import { FEN_NEW_GAME } from "@/constants/fen"
import { BoardCastlingRights, BoardMatrix } from "@/types/board"
import { Piece, PieceColor, PiecePosition } from "@/types/piece"
import { parseFen, parseFenActiveColor, parseFenCastlingRights, parseFenPlacement } from "@/utils/fen"
import { useEffect, useState } from "react"

export const useBoard = () => {
  const [board, setBoard] = useState<BoardMatrix>([])
  const [activeColor, setActiveColor] = useState<PieceColor>('white')
  const [castlingRights, setCastlingRights] = useState<BoardCastlingRights>({
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true }
  })
  const [halfmove, setHalfmove] = useState(0)
  const [fullmove, setFullmove] = useState(0)
  const [perspective, setPerspective] = useState<PieceColor>("white")

  // selected/focused/highlighted piece
  const [activePiece, setActivePiece] = useState<Piece | null>(null)

  const loadNewGame = () => {
    const { placement, activeColor, castlingRights, enPassantTarget, halfmove, fullmove } = parseFen(FEN_NEW_GAME)
    const parsedBoard = parseFenPlacement(placement)
    const parsedActiveColor = parseFenActiveColor(activeColor)
    const parsedCastlingRights = parseFenCastlingRights(castlingRights)

    setBoard(parsedBoard)
    setActiveColor(parsedActiveColor)
    setCastlingRights(parsedCastlingRights)
    setHalfmove(parseInt(halfmove))
    setFullmove(parseInt(fullmove))
  }

  const selectPiece = (piece: Piece) => {
    // only can select your own piece
    // if (piece.color !== playerColor) return
    const sameSquare = activePiece && activePiece.position.file === piece.position.file && activePiece.position.rank === piece.position.rank

    setActivePiece(sameSquare ? null : piece)
    // TODO: set legal moves
  }

  // Move or capture a piece
  const makeMove = (newPosition: PiecePosition) => {
    if (!activePiece) return

    const getBoardIndex = (position: PiecePosition) => ({
      rank: 8 - position.rank,
      file: position.file - 1
    })

    // TODO: check if new position is in legal moves

    const newBoard = [...board]
    const oldIndex = getBoardIndex(activePiece.position)
    const newIndex = getBoardIndex(newPosition)

    newBoard[oldIndex.rank][oldIndex.file] = null
    newBoard[newIndex.rank][newIndex.file] = activePiece.notation

    setBoard(newBoard)
    setActivePiece(null)
  }

  useEffect(() => {
    loadNewGame()
  }, [])

  return { board, perspective, activeColor, castlingRights, halfmove, fullmove, loadNewGame, setBoard, activePiece, setActivePiece, selectPiece, makeMove }
}
