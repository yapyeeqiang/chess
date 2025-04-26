'use client'

import Game from '@/components/game';
import PlayerInfo from '@/components/player-info';
import { useBoard } from '@/providers/board-provider';
import { Player } from '@/types/player';

const whitePlayer: Player = {
  name: 'Mr. White',
  rating: 1200
}

const blackPlayer: Player = {
  name: 'Mr. Black',
  rating: 1200
}

const Home = () => {
  const { perspective } = useBoard()
  const top = perspective === 'white' ? blackPlayer : whitePlayer
  const bottom = perspective === 'white' ? whitePlayer : blackPlayer

  return (
    <div className="p-4 h-screen">
      <div className="mx-4 h-full flex flex-col">
        <div className="ml-8">
          <PlayerInfo player={top} />
        </div>

        <div className="ml-8 my-4 flex-1">
          <div className="h-full w-full relative">
            <div className="absolute h-full aspect-square">
              <Game />
            </div>
          </div>
        </div>

        <div className="ml-8">
          <PlayerInfo player={bottom} />
        </div>
      </div>
    </div>
  );
}

export default Home
