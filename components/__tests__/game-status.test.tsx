import { render, screen, fireEvent } from '@testing-library/react'
import GameStatus from '../game-status'
import type { PieceColor, GameState, ChessPiece } from '@/lib/types'

// Mock the button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  RefreshCw: () => <span data-testid="refresh-icon">refresh</span>,
}))

describe('GameStatus', () => {
  const mockOnResetGame = jest.fn()

  const defaultProps = {
    currentPlayer: 'white' as PieceColor,
    gameState: 'playing' as GameState,
    capturedPieces: {
      white: [],
      black: [],
    },
    onResetGame: mockOnResetGame,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Status Messages', () => {
    it('displays correct message for white player turn', () => {
      render(<GameStatus {...defaultProps} />)
      expect(screen.getByText("White's turn")).toBeInTheDocument()
    })

    it('displays correct message for black player turn', () => {
      render(<GameStatus {...defaultProps} currentPlayer="black" />)
      expect(screen.getByText("Black's turn")).toBeInTheDocument()
    })

    it('displays correct message when white is in check', () => {
      render(<GameStatus {...defaultProps} gameState="check" />)
      expect(screen.getByText('White is in check!')).toBeInTheDocument()
    })

    it('displays correct message when black is in check', () => {
      render(<GameStatus {...defaultProps} currentPlayer="black" gameState="check" />)
      expect(screen.getByText('Black is in check!')).toBeInTheDocument()
    })

    it('displays correct message for checkmate with white winning', () => {
      render(<GameStatus {...defaultProps} currentPlayer="black" gameState="checkmate" />)
      expect(screen.getByText('Checkmate! White wins!')).toBeInTheDocument()
    })

    it('displays correct message for checkmate with black winning', () => {
      render(<GameStatus {...defaultProps} currentPlayer="white" gameState="checkmate" />)
      expect(screen.getByText('Checkmate! Black wins!')).toBeInTheDocument()
    })

    it('displays correct message for stalemate', () => {
      render(<GameStatus {...defaultProps} gameState="stalemate" />)
      expect(screen.getByText('Stalemate! The game is a draw.')).toBeInTheDocument()
    })
  })

  describe('Status Message Styling', () => {
    it('applies red text color for checkmate', () => {
      render(<GameStatus {...defaultProps} gameState="checkmate" />)
      const statusMessage = screen.getByText('Checkmate! Black wins!')
      expect(statusMessage).toHaveClass('text-red-600')
    })

    it('applies red text color for stalemate', () => {
      render(<GameStatus {...defaultProps} gameState="stalemate" />)
      const statusMessage = screen.getByText('Stalemate! The game is a draw.')
      expect(statusMessage).toHaveClass('text-red-600')
    })

    it('does not apply red text color for normal play', () => {
      render(<GameStatus {...defaultProps} />)
      const statusMessage = screen.getByText("White's turn")
      expect(statusMessage).not.toHaveClass('text-red-600')
    })
  })

  describe('Reset Button', () => {
    it('renders reset button with correct text and icon', () => {
      render(<GameStatus {...defaultProps} />)
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument()
    })

    it('calls onResetGame when reset button is clicked', () => {
      render(<GameStatus {...defaultProps} />)
      const resetButton = screen.getByRole('button', { name: /reset/i })
      fireEvent.click(resetButton)
      expect(mockOnResetGame).toHaveBeenCalledTimes(1)
    })
  })

  describe('Captured Pieces Display', () => {
    it('shows "No pieces captured" when no pieces are captured', () => {
      render(<GameStatus {...defaultProps} />)
      const noPiecesMessages = screen.getAllByText('No pieces captured')
      expect(noPiecesMessages).toHaveLength(2)
    })

    it('displays captured white pieces correctly', () => {
      const capturedWhitePieces: ChessPiece[] = [
        { type: 'pawn', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'queen', color: 'white' },
      ]

      render(
        <GameStatus
          {...defaultProps}
          capturedPieces={{
            white: capturedWhitePieces,
            black: [],
          }}
        />
      )

      // Check that white pieces are displayed in the "Captured by Black" section
      const capturedByBlackSection = screen.getByText('Captured by Black:').closest('div')
      expect(capturedByBlackSection).toHaveTextContent('♙') // white pawn
      expect(capturedByBlackSection).toHaveTextContent('♘') // white knight
      expect(capturedByBlackSection).toHaveTextContent('♕') // white queen
    })

    it('displays captured black pieces correctly', () => {
      const capturedBlackPieces: ChessPiece[] = [
        { type: 'rook', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'king', color: 'black' },
      ]

      render(
        <GameStatus
          {...defaultProps}
          capturedPieces={{
            white: [],
            black: capturedBlackPieces,
          }}
        />
      )

      // Check that black pieces are displayed in the "Captured by White" section
      const capturedByWhiteSection = screen.getByText('Captured by White:').closest('div')
      expect(capturedByWhiteSection).toHaveTextContent('♜') // black rook
      expect(capturedByWhiteSection).toHaveTextContent('♝') // black bishop
      expect(capturedByWhiteSection).toHaveTextContent('♚') // black king
    })

    it('displays all piece types with correct Unicode symbols', () => {
      const allWhitePieces: ChessPiece[] = [
        { type: 'king', color: 'white' },
        { type: 'queen', color: 'white' },
        { type: 'rook', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'pawn', color: 'white' },
      ]

      const allBlackPieces: ChessPiece[] = [
        { type: 'king', color: 'black' },
        { type: 'queen', color: 'black' },
        { type: 'rook', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'pawn', color: 'black' },
      ]

      render(
        <GameStatus
          {...defaultProps}
          capturedPieces={{
            white: allWhitePieces,
            black: allBlackPieces,
          }}
        />
      )

      // White pieces (captured by black)
      const capturedByBlackSection = screen.getByText('Captured by Black:').closest('div')
      expect(capturedByBlackSection).toHaveTextContent('♔♕♖♗♘♙')

      // Black pieces (captured by white)
      const capturedByWhiteSection = screen.getByText('Captured by White:').closest('div')
      expect(capturedByWhiteSection).toHaveTextContent('♚♛♜♝♞♟')
    })

    it('hides "No pieces captured" message when pieces are captured', () => {
      const capturedPieces: ChessPiece[] = [{ type: 'pawn', color: 'white' }]

      render(
        <GameStatus
          {...defaultProps}
          capturedPieces={{
            white: capturedPieces,
            black: [],
          }}
        />
      )

      const noPiecesMessages = screen.getAllByText('No pieces captured')
      expect(noPiecesMessages).toHaveLength(1) // Only one section should show this message
    })
  })

  describe('Component Structure', () => {
    it('renders main heading', () => {
      render(<GameStatus {...defaultProps} />)
      expect(screen.getByRole('heading', { name: 'Game Status' })).toBeInTheDocument()
    })

    it('renders captured pieces section headings', () => {
      render(<GameStatus {...defaultProps} />)
      expect(screen.getByText('Captured by White:')).toBeInTheDocument()
      expect(screen.getByText('Captured by Black:')).toBeInTheDocument()
    })

    it('applies correct CSS classes for styling', () => {
      const { container } = render(<GameStatus {...defaultProps} />)
      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass('bg-white', 'p-4', 'rounded-lg', 'shadow-md')
    })
  })

  describe('Edge Cases', () => {
    it('handles multiple pieces of the same type', () => {
      const multiplePawns: ChessPiece[] = [
        { type: 'pawn', color: 'black' },
        { type: 'pawn', color: 'black' },
        { type: 'pawn', color: 'black' },
      ]

      render(
        <GameStatus
          {...defaultProps}
          capturedPieces={{
            white: [],
            black: multiplePawns,
          }}
        />
      )

      const capturedByWhiteSection = screen.getByText('Captured by White:').closest('div')
      // Should display three pawn symbols
      const pawnSymbols = capturedByWhiteSection?.textContent?.match(/♟/g)
      expect(pawnSymbols).toHaveLength(3)
    })

    it('handles mixed captured pieces', () => {
      render(
        <GameStatus
          {...defaultProps}
          capturedPieces={{
            white: [{ type: 'queen', color: 'white' }],
            black: [{ type: 'rook', color: 'black' }],
          }}
        />
      )

      const capturedByWhiteSection = screen.getByText('Captured by White:').closest('div')
      const capturedByBlackSection = screen.getByText('Captured by Black:').closest('div')

      expect(capturedByWhiteSection).toHaveTextContent('♜') // black rook
      expect(capturedByBlackSection).toHaveTextContent('♕') // white queen

      // Neither section should show "No pieces captured"
      expect(screen.queryByText('No pieces captured')).not.toBeInTheDocument()
    })
  })
})
