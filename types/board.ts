import { PieceNotation } from "./piece";

export type BoardMatrix = (PieceNotation | null)[][]

export type BoardSquareNotation = {
  file: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
  rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}

type BoardCastling = {
  kingside: boolean;
  queenside: boolean;
}

export type BoardCastlingRights = {
  white: BoardCastling
  black: BoardCastling
}
