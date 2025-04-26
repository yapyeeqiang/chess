import BoardCoordinate from './board-coordinate'
import Board from './board'
import BoardGrid from './board-grid'

const Game = () => {
  return (
    <div className="relative">
      <Board className='relative h-full w-full aspect-square rounded' />

      <BoardCoordinate className='absolute top-0 left-0' />

      <BoardGrid />

      {/* {board.map((rank, rankIndex) =>
        rank.map((pieceNotation, fileIndex) => {
          const position: BoardPosition = {
            file: fileIndex + 1,
            rank: 8 - rankIndex,
          }

          const piece = pieceNotation
            ? parsePieceNotation(pieceNotation, position)
            : null

          return (
            <BoardSquare
              key={`${rankIndex}-${fileIndex}`}
              onClick={handleSquareClick}
              piece={piece}
              position={position}
            />
          )
        })
      )} */}
    </div>
  )
}

export default Game
