import { BoardCastlingRights, BoardIndex, BoardMatrix, BoardPosition } from '@/types/board'
import { Piece, PieceColor } from '@/types/piece'

import { parsePieceColor, parsePieceNotation } from './piece'

export const getBoardIndex = (
  position: BoardPosition,
  perspective: PieceColor = 'white'
) => {
  const fileIndex =
    perspective === 'white' ? position.file - 1 : 8 - position.file
  const rankIndex =
    perspective === 'white' ? 8 - position.rank : position.rank - 1

  return { fileIndex, rankIndex }
}

export const getBoardPosition = (
  { fileIndex, rankIndex }: BoardIndex,
  perspective: PieceColor = 'white'
): BoardPosition => {
  const file = perspective === 'white' ? fileIndex + 1 : 8 - fileIndex
  const rank = perspective === 'white' ? 8 - rankIndex : rankIndex + 1

  return { file, rank }
}

export const getBoardAfterMove = (
  board: BoardMatrix,
  from: BoardPosition,
  to: BoardPosition
): BoardMatrix => {
  const copy = board.map((row) => [...row]) // deep copy

  const { fileIndex: fromFile, rankIndex: fromRank } = getBoardIndex(from)
  const { fileIndex: toFile, rankIndex: toRank } = getBoardIndex(to)

  copy[toRank][toFile] = copy[fromRank][fromFile] // move piece
  copy[fromRank][fromFile] = null // clear old square

  return copy
}

export const getKingPosition = (
  board: BoardMatrix,
  color: PieceColor
): BoardPosition | null => {
  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
      const piece = board[rankIndex][fileIndex]
      if (piece?.toLowerCase() === 'k' && parsePieceColor(piece) === color) {
        return getBoardPosition({ fileIndex, rankIndex })
      }
    }
  }
  return null
}

export const isInBounds = (file: number, rank: number) =>
  file >= 0 && file < 8 && rank >= 0 && rank < 8

export const isSameBoardSquare = (from: BoardPosition, to: BoardPosition) =>
  from.file === to.file && from.rank === to.rank

export const isBoardSquareSafe = (
  board: BoardMatrix,
  position: BoardPosition,
  attackerColor: PieceColor,
  enPassantTarget: BoardPosition | null,
): boolean => {
  const opponentColor = attackerColor === 'white' ? 'black' : 'white'

  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
      const pieceNotation = board[rankIndex][fileIndex]
      const { file, rank } = getBoardPosition({ fileIndex, rankIndex })

      if (pieceNotation && parsePieceColor(pieceNotation) === opponentColor) {
        const piece = parsePieceNotation(pieceNotation, { file, rank })

        let legalMoves: BoardPosition[] = []
        switch (piece.name) {
          case 'pawn':
            legalMoves = getPawnPseudoLegalMoves(board, piece, enPassantTarget)
            break
          case 'knight':
            legalMoves = getKnightPseudoLegalMoves(board, piece)
            break
          case 'bishop':
            legalMoves = getBishopPseudoLegalMoves(board, piece)
            break
          case 'rook':
            legalMoves = getRookPseudoLegalMoves(board, piece)
            break
          case 'queen':
            legalMoves = getQueenPseudoLegalMoves(board, piece)
            break
          case 'king':
            legalMoves = getKingPseudoLegalMoves(board, piece)
            break
        }

        if (
          legalMoves.some(
            (move) => move.file === position.file && move.rank === position.rank
          )
        ) {
          return false
        }
      }
    }
  }

  return true
}

export const isCheck = (
  board: BoardMatrix,
  color: PieceColor,
  enPassantTarget: BoardPosition | null,
): boolean => {
  const kingPosition = getKingPosition(board, color)
  if (!kingPosition) return false

  return !isBoardSquareSafe(
    board,
    kingPosition,
    color,
    enPassantTarget,
  )
}

export const isCheckmate = (
  board: BoardMatrix,
  color: PieceColor,
  enPassantTarget: BoardPosition | null,
  castlingRights: BoardCastlingRights
): boolean => {
  if (!isCheck(board, color, enPassantTarget)) return false

  // Loop through all pieces of color
  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
      const pieceNotation = board[rankIndex][fileIndex]
      if (!pieceNotation || parsePieceColor(pieceNotation) !== color) continue

      const position = getBoardPosition({ fileIndex, rankIndex })
      const piece = parsePieceNotation(pieceNotation, position)

      let legalMoves: BoardPosition[] = []

      switch (piece.name) {
        case 'pawn':
          legalMoves = getPawnLegalMoves(board, piece, enPassantTarget)
          break
        case 'knight':
          legalMoves = getKnightLegalMoves(board, piece, enPassantTarget)
          break
        case 'bishop':
          legalMoves = getBishopLegalMoves(board, piece, enPassantTarget)
          break
        case 'rook':
          legalMoves = getRookLegalMoves(board, piece, enPassantTarget)
          break
        case 'queen':
          legalMoves = getQueenLegalMoves(board, piece, enPassantTarget)
          break
        case 'king':
          legalMoves = getKingLegalMoves(board, piece, enPassantTarget, castlingRights)
          break
      }

      if (legalMoves.length > 0) return false
    }
  }

  return true
}

export const isStalemate = (
  board: BoardMatrix,
  color: PieceColor,
  enPassantTarget: BoardPosition | null,
  castlingRights: BoardCastlingRights
): boolean => {
  if (isCheck(board, color, enPassantTarget)) return false

  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
      const pieceNotation = board[rankIndex][fileIndex]
      if (!pieceNotation || parsePieceColor(pieceNotation) !== color) continue

      const position = getBoardPosition({ fileIndex, rankIndex })
      const piece = parsePieceNotation(pieceNotation, position)

      let legalMoves: BoardPosition[] = []

      switch (piece.name) {
        case 'pawn':
          legalMoves = getPawnLegalMoves(board, piece, enPassantTarget)
          break
        case 'knight':
          legalMoves = getKnightLegalMoves(board, piece, enPassantTarget)
          break
        case 'bishop':
          legalMoves = getBishopLegalMoves(board, piece, enPassantTarget)
          break
        case 'rook':
          legalMoves = getRookLegalMoves(board, piece, enPassantTarget)
          break
        case 'queen':
          legalMoves = getQueenLegalMoves(board, piece, enPassantTarget)
          break
        case 'king':
          legalMoves = getKingLegalMoves(board, piece, enPassantTarget, castlingRights)
          break
      }

      if (legalMoves.length > 0) return false
    }
  }

  return true
}

export const getSlidingPiecePseudoLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  directions: number[][]
) => {
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
      const { file, rank } = getBoardPosition({ fileIndex: newFileIndex, rankIndex: newRankIndex })

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
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ]
  const legalMoves: BoardPosition[] = []

  for (const [df, dr] of moves) {
    const newFileIndex = fileIndex + df
    const newRankIndex = rankIndex + dr

    if (isInBounds(newFileIndex, newRankIndex)) {
      const targetPieceNotation = board[newRankIndex][newFileIndex]

      if (
        !targetPieceNotation ||
        sourcePieceColor !== parsePieceColor(targetPieceNotation)
      ) {
        const { file, rank } = getBoardPosition({ fileIndex: newFileIndex, rankIndex: newRankIndex })
        legalMoves.push({ file, rank })
      }
    }
  }

  return legalMoves
}

export const getKnightLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null,
) => {
  const pseudoMoves = getKnightPseudoLegalMoves(board, piece)

  return pseudoMoves.filter((move) => {
    const boardAfterMove = getBoardAfterMove(board, piece.position, move)
    return !isCheck(
      boardAfterMove,
      piece.color,
      enPassantTarget,
    )
  })
}

export const getBishopPseudoLegalMoves = (board: BoardMatrix, piece: Piece) =>
  getSlidingPiecePseudoLegalMoves(board, piece, [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ])

export const getBishopLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null,
) => {
  const pseudoMoves = getBishopPseudoLegalMoves(board, piece)

  return pseudoMoves.filter((move) => {
    const boardAfterMove = getBoardAfterMove(board, piece.position, move)
    return !isCheck(
      boardAfterMove,
      piece.color,
      enPassantTarget
    )
  })
}

export const getRookPseudoLegalMoves = (board: BoardMatrix, piece: Piece) =>
  getSlidingPiecePseudoLegalMoves(board, piece, [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])

export const getRookLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null,
) => {
  const pseudoMoves = getRookPseudoLegalMoves(board, piece)

  return pseudoMoves.filter((move) => {
    const boardAfterMove = getBoardAfterMove(board, piece.position, move)
    return !isCheck(
      boardAfterMove,
      piece.color,
      enPassantTarget,
    )
  })
}

export const getQueenPseudoLegalMoves = (board: BoardMatrix, piece: Piece) =>
  getSlidingPiecePseudoLegalMoves(board, piece, [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])

export const getQueenLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null,
) => {
  const pseudoMoves = getQueenPseudoLegalMoves(board, piece)

  return pseudoMoves.filter((move) => {
    const boardAfterMove = getBoardAfterMove(board, piece.position, move)
    return !isCheck(
      boardAfterMove,
      piece.color,
      enPassantTarget,
    )
  })
}

export const getKingPseudoLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
) => {
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const sourcePieceNotation = board[rankIndex][fileIndex]

  if (!sourcePieceNotation) return []
  const sourcePieceColor = parsePieceColor(sourcePieceNotation)

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]

  const legalMoves: BoardPosition[] = []

  // 1. Normal 1-square king moves
  for (const [df, dr] of directions) {
    const newFileIndex = fileIndex + df
    const newRankIndex = rankIndex + dr
    const { file, rank } = getBoardPosition({ fileIndex: newFileIndex, rankIndex: newRankIndex })

    if (!isInBounds(newFileIndex, newRankIndex)) continue
    const targetPieceNotation = board[newRankIndex][newFileIndex]
    const targetPieceColor = targetPieceNotation
      ? parsePieceColor(targetPieceNotation)
      : null

    if (!targetPieceNotation || targetPieceColor !== sourcePieceColor) {
      legalMoves.push({ file, rank })
    }
  }

  return legalMoves
}

export const getKingLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null,
  castlingRights: BoardCastlingRights
) => {
  const pseudoMoves = getKingPseudoLegalMoves(board, piece)
  const color = piece.color
  const legalMoves = pseudoMoves.filter((move) => isBoardSquareSafe(board, move, color, enPassantTarget)).filter(move => {
    const boardAfterMove = getBoardAfterMove(board, piece.position, move)
    return !isCheck(boardAfterMove, color, enPassantTarget)
  })

  // castling check
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const { kingside, queenside } = castlingRights[piece.color]

  if (
    isBoardSquareSafe(
      board,
      piece.position,
      color,
      enPassantTarget,
    )
  ) {
    if (kingside) {
      const F_FILE_INDEX = fileIndex + 1
      const G_FILE_INDEX = fileIndex + 2
      const f1 = getBoardPosition({ fileIndex: F_FILE_INDEX, rankIndex })
      const g1 = getBoardPosition({ fileIndex: G_FILE_INDEX, rankIndex })

      const isClear =
        !board[rankIndex][F_FILE_INDEX] && !board[rankIndex][G_FILE_INDEX]
      const isSafe =
        isBoardSquareSafe(board, f1, color, enPassantTarget) &&
        isBoardSquareSafe(board, g1, color, enPassantTarget)

      if (isClear && isSafe) {
        legalMoves.push(g1)
      }
    }

    if (queenside) {
      const B_FILE_INDEX = fileIndex - 3
      const C_FILE_INDEX = fileIndex - 2
      const D_FILE_INDEX = fileIndex - 1
      const c1 = getBoardPosition({ fileIndex: C_FILE_INDEX, rankIndex })
      const d1 = getBoardPosition({ fileIndex: D_FILE_INDEX, rankIndex })

      const isClear =
        !board[rankIndex][D_FILE_INDEX] &&
        !board[rankIndex][C_FILE_INDEX] &&
        !board[rankIndex][B_FILE_INDEX]
      const isSafe =
        isBoardSquareSafe(board, c1, color, enPassantTarget) &&
        isBoardSquareSafe(board, d1, color, enPassantTarget)

      if (isClear && isSafe) {
        legalMoves.push(c1)
      }
    }
  }

  return legalMoves
}

export const getPawnPseudoLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null
) => {
  const { fileIndex, rankIndex } = getBoardIndex(piece.position)
  const direction = piece.color === 'white' ? -1 : 1
  const startRankIndex = piece.color === 'white' ? 6 : 1
  const legalMoves: BoardPosition[] = []

  // 1 step forward
  if (!board[rankIndex + direction]?.[fileIndex]) {
    legalMoves.push(getBoardPosition({ fileIndex, rankIndex: rankIndex + direction }))

    // 2 steps forward from starting rank
    if (
      rankIndex === startRankIndex &&
      !board[rankIndex + 2 * direction]?.[fileIndex]
    ) {
      legalMoves.push(getBoardPosition({ fileIndex, rankIndex: rankIndex + 2 * direction }))
    }
  }

  // Diagonal captures and en passant
  for (const df of [-1, 1]) {
    const newFileIndex = fileIndex + df
    const newRankIndex = rankIndex + direction

    if (!isInBounds(newFileIndex, newRankIndex)) continue

    const targetPieceNotation = board[newRankIndex][newFileIndex]
    const targetPieceColor = targetPieceNotation
      ? parsePieceColor(targetPieceNotation)
      : null
    const { file, rank } = getBoardPosition({ fileIndex: newFileIndex, rankIndex: newRankIndex })

    if (targetPieceNotation && targetPieceColor !== piece.color) {
      legalMoves.push({ file, rank })
    } else if (
      enPassantTarget &&
      enPassantTarget.file === file &&
      enPassantTarget.rank
    ) {
      legalMoves.push({ file, rank })
    }
  }

  return legalMoves
}

export const getPawnLegalMoves = (
  board: BoardMatrix,
  piece: Piece,
  enPassantTarget: BoardPosition | null,
) => {
  const pseudoMoves = getPawnPseudoLegalMoves(board, piece, enPassantTarget)

  return pseudoMoves.filter((move) => {
    const boardAfterMove = getBoardAfterMove(board, piece.position, move)
    return !isCheck(
      boardAfterMove,
      piece.color,
      enPassantTarget,
    )
  })
}
