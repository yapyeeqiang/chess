'use client'

import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Piece, PiecePosition, PieceColor } from '@/types/piece'; // Make sure these types are defined correctly
import { BoardCastlingRights, BoardMatrix } from '@/types/board';
import { parseFen, parseFenActiveColor, parseFenCastlingRights, parseFenPlacement } from '@/utils/fen';
import { FEN_NEW_GAME } from '@/constants/fen';
import { parsePieceColor } from '@/utils/piece';

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
  loadNewGame: () => void;
  selectPiece: (piece: Piece) => void;
  makeMove: (targetPosition: PiecePosition) => void;
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
  const [halfmove, setHalfmove] = useState(0)
  const [fullmove, setFullmove] = useState(0)
  const [perspective, setPerspective] = useState<PieceColor>("white")

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
    // TODO: set legal moves
  }

  // Move or capture a piece
  const makeMove = (targetPosition: PiecePosition) => {
    if (!activePiece) return

    const getBoardIndex = (position: PiecePosition) => ({
      rank: 8 - position.rank,
      file: position.file - 1
    })

    const targetPiecePosition = getBoardIndex(targetPosition)
    const targetPieceNotation = board[targetPiecePosition.rank][targetPiecePosition.file]

    // If the target square is occupied by a piece of the same color, return early
    if (targetPieceNotation && parsePieceColor(targetPieceNotation) === activePiece.color) {
      console.log('Cannot move to a square occupied by your own piece!')
      return
    }

    // TODO: check if new position is in legal moves

    const newBoard = [...board]
    const oldIndex = getBoardIndex(activePiece.position)
    const newIndex = getBoardIndex(targetPosition)

    newBoard[oldIndex.rank][oldIndex.file] = null
    newBoard[newIndex.rank][newIndex.file] = activePiece.notation

    setBoard(newBoard)
    setActivePiece(null)
  }

  useEffect(() => {
    loadNewGame()
  }, [])

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
        loadNewGame,
        selectPiece,
        makeMove,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
