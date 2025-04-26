import { useBoard } from "@/providers/board-provider"
import clsx from "clsx"

type Props = {} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Board = ({ ...props }: Props) => {
  const { board } = useBoard()

  return (
    <div {...props}>
      {board.map((rank, rankIndex) =>
        rank.map((_, fileIndex) => {
          const translateX = fileIndex * 100
          const translateY = rankIndex * 100

          return (
            <div
              key={`${rankIndex}-${fileIndex}`}
              style={{
                transform: `translate3d(${translateX}%, ${translateY}%, 0)`,
                transition: 'transform 0.2s ease-in-out',
              }}
              className={
                clsx(
                  (fileIndex + rankIndex) % 2 === 0 ? 'bg-[#edd6b0]' : 'bg-[#b98761]',
                  'absolute top-0 left-0 w-[12.5%] h-[12.5%] touch-none overflow-hidden will-change-transform transition-transform ease-in-out duration-200'
                )
              }
            />
          )
        })
      )}
    </div>
  )
}

export default Board
