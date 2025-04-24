import { Player } from '@/types/player'

type Props = {
  player: Player
}

const PlayerInfo = ({ player }: Props) => {
  return (
    <div className="flex items-start">
      <div className="shrink-0 mr-3 w-10 h-10 rounded-sm overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="/avatar.gif"
          alt="Player Top Avatar"
        />
      </div>

      <div className="flex items-center gap-[.4rem]">
        <p className="font-semibold">{player.name}</p>
        <span className="text-white/[72%]">({player.rating})</span>
      </div>
    </div>
  )
}

export default PlayerInfo
