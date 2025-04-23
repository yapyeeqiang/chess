import { PieceColor, PiecePosition } from "@/types/piece";

export const getTranslatedPosition = (position: PiecePosition, perspective: PieceColor) => {
  const file = perspective === 'white' ? position.file - 1 : 8 - position.file
  const rank = perspective === 'white' ? 8 - position.rank : position.rank - 1

  return { file, rank }
}
