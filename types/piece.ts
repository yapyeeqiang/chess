import { BoardPosition } from "@/types/board"

export type PieceColor = 'white' | 'black'

export type WhitePieceNotation = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K'
export type BlackPieceNotation = 'p' | 'r' | 'n' | 'b' | 'q' | 'k'
export type PieceNotation = WhitePieceNotation | BlackPieceNotation

export type PieceName = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export type Piece = {
  name: PieceName
  notation: PieceNotation
  color: PieceColor
  position: BoardPosition
  hasMoved?: boolean
}
