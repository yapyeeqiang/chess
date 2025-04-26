import BoardCoordinate from './board-coordinate'
import Board from './board'
import BoardGrid from './board-grid'

const Game = () => {
  return (
    <div className="relative">
      <Board className='relative h-full w-full aspect-square rounded' />

      <BoardCoordinate className='absolute top-0 left-0' />

      <BoardGrid />
    </div>
  )
}

export default Game
