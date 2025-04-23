import { PieceColor, PiecePosition } from "@/types/piece"
import { getTranslatedPosition } from "@/utils/board";

type Props = {
  position: PiecePosition;
  perspective: PieceColor
}

const HighlightSquare = ({ position, perspective }: Props) => {
  const { file, rank } = getTranslatedPosition(position, perspective)

  return (
    <div
      className="absolute top-0 left-0 h-[12.5%] w-[12.5%] bg-[#FFFF33] opacity-50 z-10"
      style={{
        transform: `translate3d(${file * 100}%, ${rank * 100}%, 0)`,
      }}
    />
  )
}

export default HighlightSquare
