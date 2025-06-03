"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./chess-board"
import GameStatus from "./game-status"
import MoveHistory from "./move-history"
import { initialBoard, getPossibleMoves, makeMove, isCheck, isCheckmate, isStalemate } from "@/lib/chess-logic"
import type { PieceType, PieceColor, ChessPiece, Position, GameState, Move } from "@/lib/types"

export default function ChessGame() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoard())
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white")
  const [gameState, setGameState] = useState<GameState>("playing")
  const [capturedPieces, setCapturedPieces] = useState<{
    white: ChessPiece[]
    black: ChessPiece[]
  }>({ white: [], black: [] })
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [promotionPending, setPromotionPending] = useState<{
    from: Position
    to: Position
  } | null>(null)

  // Check for check, checkmate, or stalemate after each move
  useEffect(() => {
    if (isCheck(board, currentPlayer)) {
      if (isCheckmate(board, currentPlayer)) {
        setGameState("checkmate")
      } else {
        setGameState("check")
      }
    } else if (isStalemate(board, currentPlayer)) {
      setGameState("stalemate")
    } else {
      setGameState("playing")
    }
  }, [board, currentPlayer])

  const handleSquareClick = (position: Position) => {
    const [row, col] = position
    const piece = board[row][col]

    // If a piece is already selected
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece
      const selectedPieceObj = board[selectedRow][selectedCol]

      // If clicking on the same piece, deselect it
      if (selectedRow === row && selectedCol === col) {
        setSelectedPiece(null)
        setPossibleMoves([])
        return
      }

      // If clicking on a possible move position
      if (possibleMoves.some(([r, c]) => r === row && c === col)) {
        // Check for pawn promotion
        if (
          selectedPieceObj?.type === "pawn" &&
          ((selectedPieceObj.color === "white" && row === 0) || (selectedPieceObj.color === "black" && row === 7))
        ) {
          setPromotionPending({ from: selectedPiece, to: position })
          return
        }

        // Make the move
        const result = makeMove(board, selectedPiece, position)
        setBoard(result.newBoard)

        // Update captured pieces
        if (result.capturedPiece) {
          setCapturedPieces({
            ...capturedPieces,
            [result.capturedPiece.color]: [...capturedPieces[result.capturedPiece.color], result.capturedPiece],
          })
        }

        // Add move to history
        setMoveHistory([
          ...moveHistory,
          {
            piece: selectedPieceObj!,
            from: selectedPiece,
            to: position,
            captured: result.capturedPiece || null,
            isCheck: result.isCheck || false,
            isCheckmate: result.isCheckmate || false,
          },
        ])

        // Switch player
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
        setSelectedPiece(null)
        setPossibleMoves([])
      } else if (piece && piece.color === currentPlayer) {
        // If clicking on another piece of the same color, select that piece instead
        setSelectedPiece(position)
        setPossibleMoves(getPossibleMoves(board, position))
      }
    } else {
      // If no piece is selected yet and clicked on a piece of the current player's color
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece(position)
        setPossibleMoves(getPossibleMoves(board, position))
      }
    }
  }

  const handlePromotion = (pieceType: PieceType) => {
    if (!promotionPending) return

    const { from, to } = promotionPending
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to

    // Create a new board with the promoted piece
    const newBoard = [...board.map((row) => [...row])]
    const piece = newBoard[fromRow][fromCol]

    if (!piece) return

    // Check if there's a piece to capture
    const capturedPiece = newBoard[toRow][toCol]

    // Update the board with the promoted piece
    newBoard[toRow][toCol] = { ...piece, type: pieceType, hasMoved: true }
    newBoard[fromRow][fromCol] = null

    setBoard(newBoard)

    // Update captured pieces if needed
    if (capturedPiece) {
      setCapturedPieces({
        ...capturedPieces,
        [capturedPiece.color]: [...capturedPieces[capturedPiece.color], capturedPiece],
      })
    }

    // Add move to history
    setMoveHistory([
      ...moveHistory,
      {
        piece: { ...piece, type: pieceType },
        from,
        to,
        captured: capturedPiece || null,
        promotion: pieceType,
        isCheck: isCheck(newBoard, currentPlayer === "white" ? "black" : "white"),
        isCheckmate: isCheckmate(newBoard, currentPlayer === "white" ? "black" : "white"),
      },
    ])

    // Switch player
    setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
    setPromotionPending(null)
    setSelectedPiece(null)
    setPossibleMoves([])
  }

  const resetGame = () => {
    setBoard(initialBoard())
    setSelectedPiece(null)
    setPossibleMoves([])
    setCurrentPlayer("white")
    setGameState("playing")
    setCapturedPieces({ white: [], black: [] })
    setMoveHistory([])
    setPromotionPending(null)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
      <div className="flex-1">
        <ChessBoard
          board={board}
          selectedPiece={selectedPiece}
          possibleMoves={possibleMoves}
          onSquareClick={handleSquareClick}
          currentPlayer={currentPlayer}
        />
        {promotionPending && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">Promote pawn to:</h3>
            <div className="flex justify-center space-x-4">
              {["queen", "rook", "bishop", "knight"].map((type) => (
                <button
                  key={type}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => handlePromotion(type as PieceType)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-80">
        <GameStatus
          currentPlayer={currentPlayer}
          gameState={gameState}
          capturedPieces={capturedPieces}
          onResetGame={resetGame}
        />
        <MoveHistory moves={moveHistory} />
      </div>
    </div>
  )
}
