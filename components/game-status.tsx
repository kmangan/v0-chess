"use client"

import { Button } from "@/components/ui/button"
import type { PieceColor, GameState, ChessPiece } from "@/lib/types"
import { RefreshCw } from "lucide-react"

interface GameStatusProps {
  currentPlayer: PieceColor
  gameState: GameState
  capturedPieces: {
    white: ChessPiece[]
    black: ChessPiece[]
  }
  onResetGame: () => void
}

export default function GameStatus({ currentPlayer, gameState, capturedPieces, onResetGame }: GameStatusProps) {
  const getStatusMessage = () => {
    switch (gameState) {
      case "check":
        return `${currentPlayer === "white" ? "White" : "Black"} is in check!`
      case "checkmate":
        return `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!`
      case "stalemate":
        return "Stalemate! The game is a draw."
      default:
        return `${currentPlayer === "white" ? "White" : "Black"}'s turn`
    }
  }

  const renderCapturedPieces = (pieces: ChessPiece[], color: PieceColor) => {
    if (pieces.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, index) => {
          // Map piece types to Unicode chess symbols
          let symbol
          if (color === "white") {
            switch (piece.type) {
              case "king":
                symbol = "♔"
                break
              case "queen":
                symbol = "♕"
                break
              case "rook":
                symbol = "♖"
                break
              case "bishop":
                symbol = "♗"
                break
              case "knight":
                symbol = "♘"
                break
              case "pawn":
                symbol = "♙"
                break
              default:
                symbol = ""
            }
          } else {
            switch (piece.type) {
              case "king":
                symbol = "♚"
                break
              case "queen":
                symbol = "♛"
                break
              case "rook":
                symbol = "♜"
                break
              case "bishop":
                symbol = "♝"
                break
              case "knight":
                symbol = "♞"
                break
              case "pawn":
                symbol = "♟"
                break
              default:
                symbol = ""
            }
          }

          return (
            <span key={index} className="text-xl" style={{ color: color === "white" ? "#f8fafc" : "#1e293b" }}>
              {symbol}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Game Status</h2>
        <Button variant="outline" size="sm" onClick={onResetGame} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="mb-4">
        <div
          className={`text-lg font-medium ${gameState === "checkmate" || gameState === "stalemate" ? "text-red-600" : ""}`}
        >
          {getStatusMessage()}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-medium mb-1">Captured by White:</h3>
          <div className="bg-gray-100 p-2 rounded min-h-10 flex items-center">
            {renderCapturedPieces(capturedPieces.black, "black") || (
              <span className="text-gray-400 text-sm">No pieces captured</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-1">Captured by Black:</h3>
          <div className="bg-gray-100 p-2 rounded min-h-10 flex items-center">
            {renderCapturedPieces(capturedPieces.white, "white") || (
              <span className="text-gray-400 text-sm">No pieces captured</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
