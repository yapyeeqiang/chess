import { BoardMatrix } from "@/types/board";
import { Piece, PieceColor } from "@/types/piece";
import { BoardPosition } from "@/types/board"
import { parsePieceColor } from "./piece";

export const getBoardIndex = (position: BoardPosition, perspective: PieceColor = 'white') => {
  const fileIndex = perspective === 'white' ? position.file - 1 : 8 - position.file
  const rankIndex = perspective === 'white' ? 8 - position.rank : position.rank - 1

  return { fileIndex, rankIndex }
}

export const getBoardPosition = (
  fileIndex: number,
  rankIndex: number,
  perspective: PieceColor = 'white'
): BoardPosition => {
  const file = perspective === 'white' ? fileIndex + 1 : 8 - fileIndex;
  const rank = perspective === 'white' ? 8 - rankIndex : rankIndex + 1;

  return { file, rank };
};


export const isInBounds = (file: number, rank: number) => file >= 0 && file < 8 && rank >= 0 && rank < 8

export const getSlidingPiecePseudoLegalMoves = (board: BoardMatrix, piece: Piece, directions: number[][]) => {
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const sourcePieceNotation = board[rankIndex][fileIndex]

  if (!sourcePieceNotation) return []
  const sourcePieceColor = parsePieceColor(sourcePieceNotation)

  const legalMoves: BoardPosition[] = []

  for (const [df, dr] of directions) {
    let newFileIndex = fileIndex + df
    let newRankIndex = rankIndex + dr

    while (isInBounds(newFileIndex, newRankIndex)) {
      const targetPieceNotation = board[newRankIndex][newFileIndex]
      const { file, rank } = getBoardPosition(newFileIndex, newRankIndex)

      if (!targetPieceNotation) {
        legalMoves.push({ file, rank })
      } else {
        const targetColor = parsePieceColor(targetPieceNotation)
        if (targetColor !== sourcePieceColor) {
          legalMoves.push({ file, rank })
        }
        break
      }

      newFileIndex += df
      newRankIndex += dr
    }
  }

  return legalMoves
}

export const getKnightPseudoLegalMoves = (board: BoardMatrix, piece: Piece) => {
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const sourcePieceNotation = board[rankIndex][fileIndex]

  if (!sourcePieceNotation) return []
  const sourcePieceColor = parsePieceColor(sourcePieceNotation)

  const moves = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ];
  const legalMoves: BoardPosition[] = []

  for (const [df, dr] of moves) {
    const newFileIndex = fileIndex + df
    const newRankIndex = rankIndex + dr

    if (isInBounds(newFileIndex, newRankIndex)) {
      const targetPieceNotation = board[newRankIndex][newFileIndex]

      if (!targetPieceNotation || sourcePieceColor !== parsePieceColor(targetPieceNotation)) {
        const { file, rank } = getBoardPosition(newFileIndex, newRankIndex)
        legalMoves.push({ file, rank })
      }
    }
  }

  return legalMoves
}

export const getBishopPseudoLegalMoves = (board: BoardMatrix, piece: Piece) =>
  getSlidingPiecePseudoLegalMoves(board, piece, [[1, 1], [1, -1], [-1, 1], [-1, -1]])

export const getRookPseudoLegalMoves = (board: BoardMatrix, piece: Piece) =>
  getSlidingPiecePseudoLegalMoves(board, piece, [[1, 0], [-1, 0], [0, 1], [0, -1]])

export const getQueenPseudoLegalMoves = (board: BoardMatrix, piece: Piece) =>
  getSlidingPiecePseudoLegalMoves(board, piece, [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]])

export const getKingPseudoLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  isSquareAttacked: (fileIndex: number, rankIndex: number, color: PieceColor) => boolean
) => {
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const sourcePieceNotation = board[rankIndex][fileIndex]

  if (!sourcePieceNotation) return []
  const sourcePieceColor = parsePieceColor(sourcePieceNotation)

  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]

  const legalMoves: BoardPosition[] = []

  // 1. Normal 1-square king moves
  for (const [df, dr] of directions) {
    const newFileIndex = fileIndex + df
    const newRankIndex = rankIndex + dr
    const { file, rank } = getBoardPosition(newFileIndex, newRankIndex)

    if (!isInBounds(newFileIndex, newRankIndex)) continue
    const targetPieceNotation = board[newRankIndex][newFileIndex]
    const targetPieceColor = targetPieceNotation ? parsePieceColor(targetPieceNotation) : null

    if ((!targetPieceNotation || targetPieceColor !== sourcePieceColor) && !isSquareAttacked(newFileIndex, newRankIndex, sourcePieceColor)) {
      // Avoid moving into check
      legalMoves.push({ file, rank })
    }
  }

  return legalMoves
}

export const getPawnPseudoLegalMoves = (board: BoardMatrix, piece: Piece, enPassantTarget: BoardPosition | null) => {
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const direction = piece.color === 'white' ? -1 : 1
  const startRankIndex = piece.color === 'white' ? 6 : 1
  const legalMoves: BoardPosition[] = []

  // 1 step forward
  if (!board[rankIndex + direction]?.[fileIndex]) {
    legalMoves.push(getBoardPosition(fileIndex, rankIndex + direction))

    // 2 steps forward from starting rank
    if (rankIndex === startRankIndex && !board[rankIndex + 2 * direction]?.[fileIndex]) {
      legalMoves.push(getBoardPosition(fileIndex, rankIndex + 2 * direction))
    }
  }

  // Diagonal captures and en passant
  for (const df of [-1, 1]) {
    const newFileIndex = fileIndex + df
    const newRankIndex = rankIndex + direction

    if (!isInBounds(newFileIndex, newRankIndex)) continue;

    const targetPieceNotation = board[newRankIndex][newFileIndex]
    const targetPieceColor = targetPieceNotation ? parsePieceColor(targetPieceNotation) : null
    const { file, rank } = getBoardPosition(newFileIndex, newRankIndex)

    if (targetPieceNotation && targetPieceColor !== piece.color) {
      legalMoves.push({ file, rank })
    } else if (enPassantTarget && enPassantTarget.file === file && enPassantTarget.rank) {
      legalMoves.push({ file, rank })
    }
  }

  return legalMoves
}
