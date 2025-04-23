import { Piece } from "@/types/piece"

type Props = {
  piece: Piece
}

const ChessPiece = ({ piece }: Props) => {
  const { name, color } = piece

  return (
    <img
      src={`/pieces/${color}/${name}.png`}
      alt={`${color} ${name}`}
    />
  )
}

export default ChessPiece
