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

The project includes comprehensive unit tests for React components:

### GameStatus Component
- Status message display for all game states (playing, check, checkmate, stalemate)
- Correct player turn indication
- Status message styling (red text for game-ending states)
- Reset button functionality and interaction
- Captured pieces display with Unicode chess symbols
- All piece types rendering correctly
- Empty state handling ("No pieces captured")
- Multiple pieces of same type
- Mixed captured pieces scenarios
- Component structure and CSS classes

## Test Structure

Tests are located in `components/__tests__/` directory and follow the naming convention `*.test.tsx`.

Each test file corresponds to a component being tested and includes:
- Mock data setup
- Individual test cases for different scenarios
- Assertions for expected behavior
- Clean setup and teardown
