import clsx from 'clsx'
import { useBoard } from '@/providers/board-provider'

type Props = {} & React.SVGProps<SVGSVGElement>

const baseRanks = [8, 7, 6, 5, 4, 3, 2, 1]
const baseFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const BoardCoordinate = ({ className, ...props }: Props) => {
  const { perspective } = useBoard()
  const ranks = perspective === 'white' ? baseRanks : [...baseRanks].reverse()
  const files = perspective === 'white' ? baseFiles : [...baseFiles].reverse()

  return (
    <svg viewBox="0 0 100 100" className={clsx('select-none bg-transparent pointer-events-none', className)} {...props}>
      {ranks.map((rank, i) => (
        <text
          key={`rank-${rank}`}
          x="0.75"
          y={i * 12.5 + 3.25}
          fontSize={2.8}
          className={clsx(
            i % 2 == 0 ? 'fill-[#b98761]' : 'fill-[#edd6b0]',
            'font-semibold'
          )}
        >
          {rank}
        </text>
      ))}
      {files.map((file, i) => (
        <text
          key={`file-${file}`}
          x={i * 12.5 + 10}
          y="99"
          fontSize={2.8}
          className={clsx(
            i % 2 == 0 ? 'fill-[#edd6b0]' : 'fill-[#b98761]',
            'font-semibold'
          )}
        >
          {file}
        </text>
      ))}
    </svg>
  )
}

export default BoardCoordinate
