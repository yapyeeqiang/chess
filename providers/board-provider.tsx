'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { FEN_NEW_GAME } from '@/constants/fen'
import {
  BoardCastlingRights,
  BoardMatrix,
  BoardMove,
  BoardPosition,
} from '@/types/board'
import { Piece, PieceColor } from '@/types/piece'
import {
  getBishopLegalMoves,
  getBoardIndex,
  getKingLegalMoves,
  getKnightLegalMoves,
  getPawnLegalMoves,
  getQueenLegalMoves,
  getRookLegalMoves,
  isSameBoardSquare,
} from '@/utils/board'
import {
  parseFen,
  parseFenActiveColor,
  parseFenCastlingRights,
  parseFenPlacement,
} from '@/utils/fen'
import { parsePieceColor } from '@/utils/piece'

interface BoardContextType {
  board: BoardMatrix
  setBoard: React.Dispatch<React.SetStateAction<BoardMatrix>>
  activePiece: Piece | null
  setActivePiece: React.Dispatch<React.SetStateAction<Piece | null>>
  activeColor: PieceColor
  setActiveColor: React.Dispatch<React.SetStateAction<PieceColor>>
  castlingRights: BoardCastlingRights
  setCastlingRights: React.Dispatch<React.SetStateAction<BoardCastlingRights>>
  halfmove: number
  setHalfmove: React.Dispatch<React.SetStateAction<number>>
  fullmove: number
  setFullmove: React.Dispatch<React.SetStateAction<number>>
  perspective: PieceColor
  setPerspective: React.Dispatch<React.SetStateAction<PieceColor>>
  pseudoLegalMoves: BoardPosition[]
  loadNewGame: () => void
  selectPiece: (piece: Piece) => void
  makeMove: (targetPosition: BoardPosition) => void
  handleSquareClick: (piece: Piece | null, position: BoardPosition) => void
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider')
  }
  return context
}

interface BoardProviderProps {
  children: React.ReactNode
}

export const BoardProvider = ({ children }: BoardProviderProps) => {
  const [board, setBoard] = useState<BoardMatrix>([])
  const [activePiece, setActivePiece] = useState<Piece | null>(null)
  const [activeColor, setActiveColor] = useState<PieceColor>('white')
  const [castlingRights, setCastlingRights] = useState<BoardCastlingRights>({
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true },
  })
  const [enPassantTarget, setEnPassantTarget] = useState<BoardPosition | null>(
    null
  )
  const [halfmove, setHalfmove] = useState(0)
  const [fullmove, setFullmove] = useState(0)
  const [perspective, setPerspective] = useState<PieceColor>('white')
  const [moveHistory, setMoveHistory] = useState<BoardMove[]>([])
  const [pseudoLegalMoves, setPseudoLegalMoves] = useState<BoardPosition[]>([])

  const loadNewGame = useCallback(() => {
    const {
      placement,
      activeColor,
      castlingRights,
      enPassantTarget,
      halfmove,
      fullmove,
    } = parseFen(FEN_NEW_GAME)
    const parsedBoard = parseFenPlacement(placement)
    const parsedActiveColor = parseFenActiveColor(activeColor)
    const parsedCastlingRights = parseFenCastlingRights(castlingRights)

    setBoard(parsedBoard)
    setActiveColor(parsedActiveColor)
    setCastlingRights(parsedCastlingRights)
    setHalfmove(parseInt(halfmove))
    setFullmove(parseInt(fullmove))
  }, [])

  const selectPiece = (piece: Piece) => {
    if (piece.color !== activeColor) return

    const sameSquare =
      activePiece && isSameBoardSquare(activePiece.position, piece.position)

    setActivePiece(sameSquare ? null : piece)
  }

  // Move or capture a piece
  const makeMove = (targetPosition: BoardPosition) => {
    if (!activePiece) return

    const { rankIndex: fromRankIndex, fileIndex: fromFileIndex } =
      getBoardIndex(activePiece.position)
    const { rankIndex: toRankIndex, fileIndex: toFileIndex } =
      getBoardIndex(targetPosition)
    const targetPieceNotation = board[toRankIndex][toFileIndex]
    const sameColor =
      targetPieceNotation &&
      parsePieceColor(targetPieceNotation) === activePiece.color
    const isPseudoLegalMove = pseudoLegalMoves.some(
      (move) =>
        move.file === targetPosition.file && move.rank === targetPosition.rank
    )
    const isEnPassantMove =
      activePiece.name === 'pawn' &&
      enPassantTarget &&
      targetPosition.file === enPassantTarget.file &&
      targetPosition.rank === enPassantTarget.rank
    const isCastlingMove =
      activePiece.name === 'king' && Math.abs(toFileIndex - fromFileIndex) === 2

    // If the target square is occupied by a piece of the same color, return early
    if (sameColor || !isPseudoLegalMove) {
      console.log('Illegal move')
      return
    }

    const updatedBoard = [...board]
    updatedBoard[fromRankIndex][fromFileIndex] = null
    updatedBoard[toRankIndex][toFileIndex] = activePiece.notation

    if (isEnPassantMove) {
      const captureRankIndex =
        activePiece.color === 'white' ? toRankIndex + 1 : toRankIndex - 1
      updatedBoard[captureRankIndex][toFileIndex] = null
    }

    if (isCastlingMove) {
      const rookFromFileIndex = toFileIndex === 6 ? 7 : 0
      const rookToFileIndex = toFileIndex === 6 ? 5 : 3
      const rookRankIndex = toRankIndex

      const rook = board[rookRankIndex][rookFromFileIndex]
      updatedBoard[rookRankIndex][rookFromFileIndex] = null
      updatedBoard[rookRankIndex][rookToFileIndex] = rook
    }

    // after pawn move, check if has en passant target
    if (activePiece.name === 'pawn') {
      const fromRank = activePiece.position.rank
      const toRank = targetPosition.rank
      const dRank = Math.abs(fromRank - toRank)

      if (dRank === 2) {
        setEnPassantTarget({
          file: activePiece.position.file,
          rank: (fromRank + toRank) / 2,
        })
      } else {
        setEnPassantTarget(null)
      }
    } else {
      setEnPassantTarget(null)
    }

    if (activePiece.name === 'king') {
      setCastlingRights((prev) => ({
        ...prev,
        [activePiece.color]: {
          kingside: false,
          queenside: false,
        },
      }))
    }

    if (activePiece.name === 'rook') {
      const { file } = activePiece.position
      const isKingsideRook = file === 8
      const isQueensideRook = file === 1

      setCastlingRights((prev) => ({
        ...prev,
        [activePiece.color]: {
          kingside: isKingsideRook ? false : prev[activePiece.color].kingside,
          queenside: isQueensideRook
            ? false
            : prev[activePiece.color].queenside,
        },
      }))
    }

    setBoard(updatedBoard)
    setActivePiece(null)
    setActiveColor((prev) => (prev === 'white' ? 'black' : 'white'))
  }

  const handleSquareClick = (piece: Piece | null, position: BoardPosition) => {
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

  useEffect(() => {
    loadNewGame()
  }, [])

  useEffect(() => {
    if (!activePiece) {
      setPseudoLegalMoves([])
      return
    }

    const moveGenerators: Record<string, () => BoardPosition[]> = {
      knight: () =>
        getKnightLegalMoves(board, activePiece, enPassantTarget),
      bishop: () =>
        getBishopLegalMoves(board, activePiece, enPassantTarget),
      rook: () =>
        getRookLegalMoves(board, activePiece, enPassantTarget),
      queen: () =>
        getQueenLegalMoves(board, activePiece, enPassantTarget),
      king: () =>
        getKingLegalMoves(board, activePiece, enPassantTarget, castlingRights),
      pawn: () =>
        getPawnLegalMoves(board, activePiece, enPassantTarget),
    }

    const generator = moveGenerators[activePiece.name]
    setPseudoLegalMoves(generator ? generator() : [])
  }, [activePiece, enPassantTarget])

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        activePiece,
        setActivePiece,
        activeColor,
        setActiveColor,
        castlingRights,
        setCastlingRights,
        halfmove,
        setHalfmove,
        fullmove,
        setFullmove,
        perspective,
        setPerspective,
        pseudoLegalMoves,
        loadNewGame,
        selectPiece,
        makeMove,
        handleSquareClick,
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}
