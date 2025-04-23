export type PieceColor = 'white' | 'black'

export type WhitePieceNotation = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K'
export type BlackPieceNotation = 'p' | 'r' | 'n' | 'b' | 'q' | 'k'
export type PieceNotation = WhitePieceNotation | BlackPieceNotation

export type PieceName = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export type PiecePosition = {
  file: number
  rank: number
}

export type Piece = {
  name: PieceName
  notation: PieceNotation
  color: PieceColor
  position: PiecePosition
  hasMoved?: boolean
}
