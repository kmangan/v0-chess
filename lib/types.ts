export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
export type PieceColor = "white" | "black"
export type GameState = "playing" | "check" | "checkmate" | "stalemate"

export interface ChessPiece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

export type Position = [number, number] // [row, col]

export interface Move {
  piece: ChessPiece
  from: Position
  to: Position
  captured: ChessPiece | null
  promotion?: PieceType
  isCheck?: boolean
  isCheckmate?: boolean
}

export interface MoveResult {
  newBoard: (ChessPiece | null)[][]
  capturedPiece: ChessPiece | null
  isCheck?: boolean
  isCheckmate?: boolean
}
