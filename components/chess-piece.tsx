import type { ChessPiece } from "@/lib/types"

interface ChessPieceProps {
  piece: ChessPiece
}

export default function ChessPieceComponent({ piece }: ChessPieceProps) {
  const { type, color } = piece

  // Map piece types to Unicode chess symbols
  const getPieceSymbol = () => {
    if (color === "white") {
      switch (type) {
        case "king":
          return "♔"
        case "queen":
          return "♕"
        case "rook":
          return "♖"
        case "bishop":
          return "♗"
        case "knight":
          return "♘"
        case "pawn":
          return "♙"
        default:
          return ""
      }
    } else {
      switch (type) {
        case "king":
          return "♚"
        case "queen":
          return "♛"
        case "rook":
          return "♜"
        case "bishop":
          return "♝"
        case "knight":
          return "♞"
        case "pawn":
          return "♟"
        default:
          return ""
      }
    }
  }

  return (
    <div className="text-4xl select-none" style={{ color: color === "white" ? "#f8fafc" : "#1e293b" }}>
      {getPieceSymbol()}
    </div>
  )
}
