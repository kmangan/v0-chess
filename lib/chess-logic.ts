import type { ChessPiece, Position, PieceColor, MoveResult } from "./types"

// Initialize the chess board with pieces in their starting positions
export function initialBoard(): (ChessPiece | null)[][] {
  const board: (ChessPiece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" }
    board[6][col] = { type: "pawn", color: "white" }
  }

  // Set up rooks
  board[0][0] = { type: "rook", color: "black" }
  board[0][7] = { type: "rook", color: "black" }
  board[7][0] = { type: "rook", color: "white" }
  board[7][7] = { type: "rook", color: "white" }

  // Set up knights
  board[0][1] = { type: "knight", color: "black" }
  board[0][6] = { type: "knight", color: "black" }
  board[7][1] = { type: "knight", color: "white" }
  board[7][6] = { type: "knight", color: "white" }

  // Set up bishops
  board[0][2] = { type: "bishop", color: "black" }
  board[0][5] = { type: "bishop", color: "black" }
  board[7][2] = { type: "bishop", color: "white" }
  board[7][5] = { type: "bishop", color: "white" }

  // Set up queens
  board[0][3] = { type: "queen", color: "black" }
  board[7][3] = { type: "queen", color: "white" }

  // Set up kings
  board[0][4] = { type: "king", color: "black" }
  board[7][4] = { type: "king", color: "white" }

  return board
}

// Get all possible moves for a piece at the given position
export function getPossibleMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece) return []

  let moves: Position[] = []

  switch (piece.type) {
    case "pawn":
      moves = getPawnMoves(board, position)
      break
    case "rook":
      moves = getRookMoves(board, position)
      break
    case "knight":
      moves = getKnightMoves(board, position)
      break
    case "bishop":
      moves = getBishopMoves(board, position)
      break
    case "queen":
      moves = getQueenMoves(board, position)
      break
    case "king":
      moves = getKingMoves(board, position)
      break
  }

  // Filter out moves that would put or leave the king in check
  return moves.filter((move) => !wouldBeInCheck(board, position, move, piece.color))
}

// Check if making a move would put or leave the king in check
function wouldBeInCheck(board: (ChessPiece | null)[][], from: Position, to: Position, color: PieceColor): boolean {
  // Create a copy of the board
  const newBoard = board.map((row) => [...row])

  // Make the move on the copy
  const [fromRow, fromCol] = from
  const [toRow, toCol] = to

  const piece = newBoard[fromRow][fromCol]
  newBoard[toRow][toCol] = piece
  newBoard[fromRow][fromCol] = null

  // Check if the king is in check after the move
  return isInCheck(newBoard, color)
}

// Check if the king of the given color is in check
function isInCheck(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  // Find the king's position
  let kingPosition: Position | null = null

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === "king" && piece.color === color) {
        kingPosition = [row, col]
        break
      }
    }
    if (kingPosition) break
  }

  if (!kingPosition) return false // Should never happen in a valid game

  // Check if any opponent piece can capture the king
  const opponentColor = color === "white" ? "black" : "white"

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === opponentColor) {
        const moves = getRawMoves(board, [row, col])
        if (moves.some(([r, c]) => r === kingPosition![0] && c === kingPosition![1])) {
          return true
        }
      }
    }
  }

  return false
}

// Get raw moves without checking if they would put the king in check
function getRawMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece) return []

  switch (piece.type) {
    case "pawn":
      return getPawnMoves(board, position)
    case "rook":
      return getRookMoves(board, position)
    case "knight":
      return getKnightMoves(board, position)
    case "bishop":
      return getBishopMoves(board, position)
    case "queen":
      return getQueenMoves(board, position)
    case "king":
      return getKingMoves(board, position)
    default:
      return []
  }
}

// Get possible moves for a pawn
function getPawnMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece || piece.type !== "pawn") return []

  const moves: Position[] = []
  const direction = piece.color === "white" ? -1 : 1

  // Move forward one square
  if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
    moves.push([row + direction, col])

    // Move forward two squares from starting position
    const startingRow = piece.color === "white" ? 6 : 1
    if (row === startingRow && !board[row + 2 * direction][col]) {
      moves.push([row + 2 * direction, col])
    }
  }

  // Capture diagonally
  const captureDirections = [
    [direction, -1],
    [direction, 1],
  ]
  for (const [dr, dc] of captureDirections) {
    const newRow = row + dr
    const newCol = col + dc

    if (
      newRow >= 0 &&
      newRow < 8 &&
      newCol >= 0 &&
      newCol < 8 &&
      board[newRow][newCol] &&
      board[newRow][newCol]!.color !== piece.color
    ) {
      moves.push([newRow, newCol])
    }

    // En passant (simplified implementation)
    // A more complete implementation would track the last move
    // and check if it was a pawn moving two squares forward
    // For now, we'll skip this feature
  }

  return moves
}

// Get possible moves for a rook
function getRookMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece) return []

  const moves: Position[] = []
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] // Up, down, left, right

  for (const [dr, dc] of directions) {
    let newRow = row + dr
    let newCol = col + dc

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol]) {
        // Empty square
        moves.push([newRow, newCol])
      } else if (board[newRow][newCol]!.color !== piece.color) {
        // Capture opponent's piece
        moves.push([newRow, newCol])
        break
      } else {
        // Own piece
        break
      }

      newRow += dr
      newCol += dc
    }
  }

  return moves
}

// Get possible moves for a knight
function getKnightMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece) return []

  const moves: Position[] = []
  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]

  for (const [dr, dc] of knightMoves) {
    const newRow = row + dr
    const newCol = col + dc

    if (
      newRow >= 0 &&
      newRow < 8 &&
      newCol >= 0 &&
      newCol < 8 &&
      (!board[newRow][newCol] || board[newRow][newCol]!.color !== piece.color)
    ) {
      moves.push([newRow, newCol])
    }
  }

  return moves
}

// Get possible moves for a bishop
function getBishopMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece) return []

  const moves: Position[] = []
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ] // Diagonals

  for (const [dr, dc] of directions) {
    let newRow = row + dr
    let newCol = col + dc

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol]) {
        // Empty square
        moves.push([newRow, newCol])
      } else if (board[newRow][newCol]!.color !== piece.color) {
        // Capture opponent's piece
        moves.push([newRow, newCol])
        break
      } else {
        // Own piece
        break
      }

      newRow += dr
      newCol += dc
    }
  }

  return moves
}

// Get possible moves for a queen (combination of rook and bishop moves)
function getQueenMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  return [...getRookMoves(board, position), ...getBishopMoves(board, position)]
}

// Get possible moves for a king
function getKingMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const [row, col] = position
  const piece = board[row][col]

  if (!piece) return []

  const moves: Position[] = []
  const kingMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  // Regular king moves
  for (const [dr, dc] of kingMoves) {
    const newRow = row + dr
    const newCol = col + dc

    if (
      newRow >= 0 &&
      newRow < 8 &&
      newCol >= 0 &&
      newCol < 8 &&
      (!board[newRow][newCol] || board[newRow][newCol]!.color !== piece.color)
    ) {
      moves.push([newRow, newCol])
    }
  }

  // Castling
  if (!piece.hasMoved) {
    // Kingside castling
    if (
      board[row][col + 3] &&
      board[row][col + 3].type === "rook" &&
      board[row][col + 3].color === piece.color &&
      !board[row][col + 3].hasMoved &&
      !board[row][col + 1] &&
      !board[row][col + 2]
    ) {
      // Check if the king is not in check and doesn't pass through check
      if (!isInCheck(board, piece.color) && !wouldBeInCheck(board, position, [row, col + 1], piece.color)) {
        moves.push([row, col + 2])
      }
    }

    // Queenside castling
    if (
      board[row][col - 4] &&
      board[row][col - 4].type === "rook" &&
      board[row][col - 4].color === piece.color &&
      !board[row][col - 4].hasMoved &&
      !board[row][col - 1] &&
      !board[row][col - 2] &&
      !board[row][col - 3]
    ) {
      // Check if the king is not in check and doesn't pass through check
      if (!isInCheck(board, piece.color) && !wouldBeInCheck(board, position, [row, col - 1], piece.color)) {
        moves.push([row, col - 2])
      }
    }
  }

  return moves
}

// Make a move on the board
export function makeMove(board: (ChessPiece | null)[][], from: Position, to: Position): MoveResult {
  const [fromRow, fromCol] = from
  const [toRow, toCol] = to

  const piece = board[fromRow][fromCol]
  const capturedPiece = board[toRow][toCol]

  if (!piece) {
    return { newBoard: board, capturedPiece: null }
  }

  // Create a copy of the board
  const newBoard = board.map((row) => [...row])

  // Handle castling
  if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
    // Kingside castling
    if (toCol > fromCol) {
      newBoard[fromRow][fromCol + 1] = newBoard[fromRow][fromCol + 3] // Move rook
      newBoard[fromRow][fromCol + 3] = null
      if (newBoard[fromRow][fromCol + 1]) {
        newBoard[fromRow][fromCol + 1].hasMoved = true
      }
    }
    // Queenside castling
    else {
      newBoard[fromRow][fromCol - 1] = newBoard[fromRow][fromCol - 4] // Move rook
      newBoard[fromRow][fromCol - 4] = null
      if (newBoard[fromRow][fromCol - 1]) {
        newBoard[fromRow][fromCol - 1].hasMoved = true
      }
    }
  }

  // Move the piece
  newBoard[toRow][toCol] = { ...piece, hasMoved: true }
  newBoard[fromRow][fromCol] = null

  // Check if the opponent is in check or checkmate
  const opponentColor = piece.color === "white" ? "black" : "white"
  const isCheckStatus = isCheck(newBoard, opponentColor)
  const isCheckmateStatus = isCheckStatus && isCheckmate(newBoard, opponentColor)

  return {
    newBoard,
    capturedPiece,
    isCheck: isCheckStatus,
    isCheckmate: isCheckmateStatus,
  }
}

// Check if a player is in check
export function isCheck(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  return isInCheck(board, color)
}

// Check if a player is in checkmate
export function isCheckmate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  // If not in check, can't be in checkmate
  if (!isCheck(board, color)) {
    return false
  }

  // Check if any move can get the king out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, [row, col])
        if (moves.length > 0) {
          return false // Found at least one legal move
        }
      }
    }
  }

  return true // No legal moves found
}

// Check if a player is in stalemate
export function isStalemate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  // If in check, it's not stalemate
  if (isCheck(board, color)) {
    return false
  }

  // Check if any move is possible
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, [row, col])
        if (moves.length > 0) {
          return false // Found at least one legal move
        }
      }
    }
  }

  return true // No legal moves found, but not in check
}
