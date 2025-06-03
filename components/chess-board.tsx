"use client"

import type { ChessPiece, Position, PieceColor } from "@/lib/types"
import ChessPieceComponent from "./chess-piece"

interface ChessBoardProps {
  board: (ChessPiece | null)[][]
  selectedPiece: Position | null
  possibleMoves: Position[]
  onSquareClick: (position: Position) => void
  currentPlayer: PieceColor
}

export default function ChessBoard({
  board,
  selectedPiece,
  possibleMoves,
  onSquareClick,
  currentPlayer,
}: ChessBoardProps) {
  const isSelected = (row: number, col: number) => {
    return selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col
  }

  const isPossibleMove = (row: number, col: number) => {
    return possibleMoves.some(([r, c]) => r === row && c === col)
  }

  const getSquareColor = (row: number, col: number) => {
    const isEven = (row + col) % 2 === 0
    return isEven ? "bg-amber-100" : "bg-amber-800"
  }

  const getSquareClasses = (row: number, col: number) => {
    let classes = `w-full h-full flex items-center justify-center relative ${getSquareColor(row, col)}`

    if (isSelected(row, col)) {
      classes += " ring-2 ring-inset ring-blue-500"
    }

    return classes
  }

  // Convert chess notation to coordinates
  const getCoordinateLabel = (row: number, col: number, isRow: boolean) => {
    if (isRow) {
      return 8 - row
    } else {
      return String.fromCharCode(97 + col) // 'a' through 'h'
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-9 grid-rows-9">
        {/* Top coordinates */}
        <div className="h-6"></div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <div key={`top-${col}`} className="h-6 flex items-center justify-center text-xs font-medium">
            {getCoordinateLabel(0, col, false)}
          </div>
        ))}

        {board.map((row, rowIndex) => (
          <>
            {/* Left coordinates */}
            <div key={`left-${rowIndex}`} className="w-6 flex items-center justify-center text-xs font-medium">
              {getCoordinateLabel(rowIndex, 0, true)}
            </div>

            {row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getSquareClasses(rowIndex, colIndex)}
                onClick={() => onSquareClick([rowIndex, colIndex])}
                style={{ aspectRatio: "1/1" }}
              >
                {piece && <ChessPieceComponent piece={piece} />}

                {/* Highlight for possible moves */}
                {isPossibleMove(rowIndex, colIndex) && (
                  <div
                    className={`absolute inset-0 bg-blue-500 bg-opacity-30 
                    ${piece ? "ring-2 ring-blue-500 ring-inset" : "flex items-center justify-center"}`}
                  >
                    {!piece && <div className="w-3 h-3 rounded-full bg-blue-500 opacity-70"></div>}
                  </div>
                )}
              </div>
            ))}
          </>
        ))}

        {/* Bottom coordinates */}
        <div className="h-6"></div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <div key={`bottom-${col}`} className="h-6 flex items-center justify-center text-xs font-medium">
            {getCoordinateLabel(0, col, false)}
          </div>
        ))}
      </div>
    </div>
  )
}
