# Testing

This project uses Jest and React Testing Library for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Coverage

The project includes comprehensive unit tests for the `MoveHistory` component, covering:

- Empty state rendering
- Basic pawn moves
- Piece moves with correct algebraic notation
- Capture moves (both pawn and piece captures)  
- Promotion moves with all piece types
- Check and checkmate notation
- Multiple moves with correct numbering
- All piece types (King, Queen, Rook, Bishop, Knight, Pawn)
- Position formatting for all squares
- Complex moves (promotion with capture and check)
- CSS class application

## Test Structure

Tests are located in `components/__tests__/` directory and follow the naming convention `*.test.tsx`.

Each test file corresponds to a component being tested and includes:
- Mock data setup
- Individual test cases for different scenarios
- Assertions for expected behavior
- Clean setup and teardown
