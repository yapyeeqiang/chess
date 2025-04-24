import { Piece } from "@/types/piece"
import { forwardRef } from "react"

type Props = {
  piece: Piece
}

const ChessPiece = forwardRef<HTMLImageElement, Props>(({ piece }, ref) => {
  const { name, color } = piece

  return (
    <img
      ref={ref}
      src={`/pieces/${color}/${name}.png`}
      alt={`${color} ${name}`}
      className="select-none"
    />
  )
})

export default ChessPiece
