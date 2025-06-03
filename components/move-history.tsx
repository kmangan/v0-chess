import type { Move } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MoveHistoryProps {
  moves: Move[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const formatPosition = (position: [number, number]) => {
    const [row, col] = position
    const file = String.fromCharCode(97 + col) // 'a' through 'h'
    const rank = 8 - row
    return `${file}${rank}`
  }

  const formatMove = (move: Move, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1
    const isWhiteMove = index % 2 === 0

    let notation = ""

    // Add piece symbol
    switch (move.piece.type) {
      case "king":
        notation += "K"
        break
      case "queen":
        notation += "Q"
        break
      case "rook":
        notation += "R"
        break
      case "bishop":
        notation += "B"
        break
      case "knight":
        notation += "N"
        break
      // Pawns don't have a symbol in algebraic notation
    }

    // Add capture symbol
    if (move.captured) {
      if (move.piece.type === "pawn") {
        notation += formatPosition(move.from)[0] // Add file for pawn captures
      }
      notation += "x"
    }

    // Add destination
    notation += formatPosition(move.to)

    // Add promotion
    if (move.promotion) {
      let promotionSymbol = ""
      switch (move.promotion) {
        case "queen":
          promotionSymbol = "Q"
          break
        case "rook":
          promotionSymbol = "R"
          break
        case "bishop":
          promotionSymbol = "B"
          break
        case "knight":
          promotionSymbol = "N"
          break
      }
      notation += `=${promotionSymbol}`
    }

    // Add check or checkmate
    if (move.isCheckmate) {
      notation += "#"
    } else if (move.isCheck) {
      notation += "+"
    }

    return (
      <div key={index} className="flex">
        {isWhiteMove && <span className="w-8 text-gray-500">{moveNumber}.</span>}
        {!isWhiteMove && <span className="w-8"></span>}
        <span className={`flex-1 ${isWhiteMove ? "text-right pr-2" : "pl-2"}`}>{notation}</span>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Move History</h2>
      <ScrollArea className="h-64 rounded border">
        <div className="p-4">
          {moves.length === 0 ? (
            <div className="text-gray-400 text-center">No moves yet</div>
          ) : (
            <div className="grid grid-cols-2 gap-y-1">{moves.map((move, index) => formatMove(move, index))}</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
