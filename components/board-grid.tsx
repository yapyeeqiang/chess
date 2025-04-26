import { useBoard } from "@/providers/board-provider"
import BoardSquare from "./board-square"
import HighlightSquare from "./highlight-square"
import HintSquare from "./hint-square"

const BoardGrid = () => {
  const { board, activePiece, pseudoLegalMoves, handleSquareClick } = useBoard()

  return (
    <div>
      {board.map((rank, rankIndex) =>
        rank.map((pieceNotation, fileIndex) => (
          <BoardSquare
            key={`${rankIndex}-${fileIndex}`}
            onClick={handleSquareClick}
            pieceNotation={pieceNotation}
            boardIndex={{ fileIndex, rankIndex }}
          />
        ))
      )}

      {activePiece && <HighlightSquare position={activePiece.position} />}

      {activePiece &&
        pseudoLegalMoves.length > 0 &&
        pseudoLegalMoves.map((move, index) => (
          <HintSquare key={index} position={move} />
        ))}
    </div>
  )
}

export default BoardGrid
