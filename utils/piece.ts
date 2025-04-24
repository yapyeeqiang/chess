import { BoardMatrix } from "@/types/board";
import { Piece, PieceColor, PieceName, PieceNotation } from "@/types/piece";
import { BoardPosition } from "@/types/board"

const pieceMap: Record<string, PieceName> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
}

export const parsePieceColor = (pieceNotation: PieceNotation) => {
  const code = pieceNotation.charCodeAt(0)
  const color: PieceColor = (code & 0x20) === 0 ? 'white' : 'black'

  return color
}

export const parsePieceNotation = (pieceNotation: PieceNotation, position: BoardPosition): Piece => {
  const color = parsePieceColor(pieceNotation)
  const key = pieceNotation.toLowerCase()
  const name: PieceName = pieceMap[key]

  return { color, name, notation: pieceNotation, position }
}
