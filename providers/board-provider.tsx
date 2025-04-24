'use client'

import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Piece, PieceColor } from '@/types/piece';
import { BoardPosition } from "@/types/board"
import { BoardCastlingRights, BoardMatrix, BoardMove } from '@/types/board';
import { parseFen, parseFenActiveColor, parseFenCastlingRights, parseFenPlacement } from '@/utils/fen';
import { FEN_NEW_GAME } from '@/constants/fen';
import { parsePieceColor } from '@/utils/piece';
import { getBishopPseudoLegalMoves, getBoardIndex, getKingPseudoLegalMoves, getKnightPseudoLegalMoves, getPawnPseudoLegalMoves, getQueenPseudoLegalMoves, getRookPseudoLegalMoves } from '@/utils/board';

interface BoardContextType {
  board: BoardMatrix;
  setBoard: React.Dispatch<React.SetStateAction<BoardMatrix>>;
  activePiece: Piece | null;
  setActivePiece: React.Dispatch<React.SetStateAction<Piece | null>>;
  activeColor: PieceColor;
  setActiveColor: React.Dispatch<React.SetStateAction<PieceColor>>;
  castlingRights: BoardCastlingRights;
  setCastlingRights: React.Dispatch<React.SetStateAction<BoardCastlingRights>>;
  halfmove: number;
  setHalfmove: React.Dispatch<React.SetStateAction<number>>;
  fullmove: number;
  setFullmove: React.Dispatch<React.SetStateAction<number>>;
  perspective: PieceColor;
  setPerspective: React.Dispatch<React.SetStateAction<PieceColor>>;
  pseudoLegalMoves: BoardPosition[];
  loadNewGame: () => void;
  selectPiece: (piece: Piece) => void;
  makeMove: (targetPosition: BoardPosition) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

interface BoardProviderProps {
  children: React.ReactNode;
}

export const BoardProvider = ({ children }: BoardProviderProps) => {
  const [board, setBoard] = useState<BoardMatrix>([]);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [activeColor, setActiveColor] = useState<PieceColor>('white');
  const [castlingRights, setCastlingRights] = useState<BoardCastlingRights>({
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true },
  });
  const [enPassantTarget, setEnPassantTarget] = useState<BoardPosition | null>(null)
  const [halfmove, setHalfmove] = useState(0)
  const [fullmove, setFullmove] = useState(0)
  const [perspective, setPerspective] = useState<PieceColor>("white")
  const [moveHistory, setMoveHistory] = useState<BoardMove[]>([])
  const [pseudoLegalMoves, setPseudoLegalMoves] = useState<BoardPosition[]>([])

  const loadNewGame = useCallback(() => {
    const { placement, activeColor, castlingRights, enPassantTarget, halfmove, fullmove } = parseFen(FEN_NEW_GAME)
    const parsedBoard = parseFenPlacement(placement)
    const parsedActiveColor = parseFenActiveColor(activeColor)
    const parsedCastlingRights = parseFenCastlingRights(castlingRights)

    setBoard(parsedBoard)
    setActiveColor(parsedActiveColor)
    setCastlingRights(parsedCastlingRights)
    setHalfmove(parseInt(halfmove))
    setFullmove(parseInt(fullmove))
  }, []);

  const selectPiece = (piece: Piece) => {
    // only can select your own piece
    // if (piece.color !== playerColor) return
    const sameSquare = activePiece && activePiece.position.file === piece.position.file && activePiece.position.rank === piece.position.rank

    setActivePiece(sameSquare ? null : piece)
  }

  // Move or capture a piece
  const makeMove = (targetPosition: BoardPosition) => {
    if (!activePiece) return

    const { rankIndex: fromRankIndex, fileIndex: fromFileIndex } = getBoardIndex(activePiece.position)
    const { rankIndex: toRankIndex, fileIndex: toFileIndex } = getBoardIndex(targetPosition)
    const targetPieceNotation = board[toRankIndex][toFileIndex]
    const sameColor = targetPieceNotation && parsePieceColor(targetPieceNotation) === activePiece.color
    const isPseudoLegalMove = pseudoLegalMoves.some(move => move.file === targetPosition.file && move.rank === targetPosition.rank)
    const isEnPassantMove = activePiece.name === 'pawn' && enPassantTarget && targetPosition.file === enPassantTarget.file && targetPosition.rank === enPassantTarget.rank
    console.log({ activePiece, enPassantTarget, targetPosition })

    // If the target square is occupied by a piece of the same color, return early
    if (sameColor || !isPseudoLegalMove) {
      console.log('Illegal move')
      return
    }

    const updatedBoard = [...board]
    updatedBoard[fromRankIndex][fromFileIndex] = null
    updatedBoard[toRankIndex][toFileIndex] = activePiece.notation

    if (isEnPassantMove) {
      const captureRankIndex = activePiece.color === 'white' ? toRankIndex + 1 : toRankIndex - 1
      updatedBoard[captureRankIndex][toFileIndex] = null
    }

    // after pawn move, check if has en passant target
    if (activePiece.name === 'pawn') {
      const fromRank = activePiece.position.rank
      const toRank = targetPosition.rank
      const dRank = Math.abs(fromRank - toRank)

      if (dRank === 2) {
        setEnPassantTarget({
          file: activePiece.position.file,
          rank: (fromRank + toRank) / 2
        })
      } else {
        setEnPassantTarget(null)
      }
    } else {
      setEnPassantTarget(null)
    }

    setBoard(updatedBoard)
    setActivePiece(null)
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
      knight: () => getKnightPseudoLegalMoves(board, activePiece),
      bishop: () => getBishopPseudoLegalMoves(board, activePiece),
      rook: () => getRookPseudoLegalMoves(board, activePiece),
      queen: () => getQueenPseudoLegalMoves(board, activePiece),
      king: () => getKingPseudoLegalMoves(board, activePiece, () => false),
      pawn: () => getPawnPseudoLegalMoves(board, activePiece, enPassantTarget),
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
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
