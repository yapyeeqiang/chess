import ChessBoard from "@/components/board";
import PlayerInfo from "@/components/player-info";
import { Player } from "@/types/player";

const playerA: Player = {
  name: 'Yap Yee Qiang',
  rating: 1200
}

const playerB: Player = {
  name: 'Stephanie Lee',
  rating: 1200
}

const Home = () => {
  return (
    <div className="p-4 h-screen">
      <div className="mx-4 h-full flex flex-col">
        <div className="ml-8">
          <PlayerInfo player={playerA} />
        </div>

        <div className="ml-8 my-4 flex-1">
          <div className="h-full w-full relative">
            <div className="absolute h-full aspect-square">
              <ChessBoard />
            </div>
          </div>
        </div>

        <div className="ml-8">
          <PlayerInfo player={playerB} />
        </div>
      </div>
    </div>
  );
}

export default Home
