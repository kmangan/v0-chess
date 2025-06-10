# v0-chess

A web-based chess game built entirely by Vercel v0. Uses Next.js, React, and TypeScript. 

## Features
- Game status display (playing, check, checkmate, stalemate)
- Move history tracking
- Captured pieces display with Unicode chess symbols
- Reset and new game functionality
- Limited unit tests with Jest and React Testing Library 

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn)

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repo
git clone https://github.com/your-username/v0-chess.git
cd v0-chess

# Install dependencies
pnpm install
# or
npm install
# or
yarn install
```

### Running the App

Start the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Building 

To build the app:

```bash
pnpm build
# or
npm run build
# or
yarn build
```

To start the server:

```bash
pnpm start
# or
npm start
# or
yarn start
```

## Testing

This project uses Jest and React Testing Library for unit testing. Tests are currently limited and need expanding.

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```
