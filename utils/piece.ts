import { BoardMatrix } from "@/types/board";
import { Piece, PieceColor, PieceName, PieceNotation, PiecePosition } from "@/types/piece";

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

export const parsePieceNotation = (pieceNotation: PieceNotation, position: PiecePosition): Piece => {
  const color = parsePieceColor(pieceNotation)
  const key = pieceNotation.toLowerCase()
  const name: PieceName = pieceMap[key]

  return { color, name, notation: pieceNotation, position }
}

export const getPawnLegalMoves = (board: BoardMatrix, piece: Piece) => {
  const direction = piece.color === 'white' ? 1 : -1
  const legalMoves: PiecePosition[] = []

  const rank = piece.position.rank

  // position: file -> 4, rank: 1
  // white: file -> 4, rank: 1
  // black: file -> 3, rank: 6
}
