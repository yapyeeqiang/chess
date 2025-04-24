import { BoardCastlingRights, BoardMatrix } from '@/types/board'
import { PieceColor, PieceNotation } from '@/types/piece'

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
export const parseFen = (fen: string) => {
  const [
    placement,
    activeColor,
    castlingRights,
    enPassantTarget,
    halfmove,
    fullmove,
  ] = fen.split(' ')

  return {
    placement,
    activeColor: activeColor as 'w' | 'b',
    castlingRights,
    enPassantTarget,
    halfmove,
    fullmove,
  }
}

export const parseFenPlacement = (fenPlacement: string) => {
  const ranks = fenPlacement.split('/')
  const parsedBoard: BoardMatrix = []

  for (const rank of ranks) {
    const parsedRank: BoardMatrix[number] = []

    for (const file of rank) {
      const isEmptySquare = /[1-8]/.test(file)

      if (isEmptySquare) {
        const emptyCount = parseInt(file, 10)
        parsedRank.push(...Array.from({ length: emptyCount }, () => null))
      } else {
        parsedRank.push(file as PieceNotation)
      }
    }

    parsedBoard.push(parsedRank)
  }

  return parsedBoard
}

export const parseFenActiveColor = (fenActiveColor: 'w' | 'b'): PieceColor => {
  if (fenActiveColor === 'w') return 'white'

  return 'black'
}

export const parseFenCastlingRights = (
  fenCastlingRights: string
): BoardCastlingRights => {
  return {
    white: {
      kingside: fenCastlingRights.includes('K'),
      queenside: fenCastlingRights.includes('Q'),
    },
    black: {
      kingside: fenCastlingRights.includes('k'),
      queenside: fenCastlingRights.includes('q'),
    },
  }
}
