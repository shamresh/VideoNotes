# Video Notes App

A React application that allows users to take timestamped notes while watching YouTube videos. Built with React, TypeScript, and Vite.

## Learning Resources

### Essential Concepts for This App

#### React Basics
- Components and JSX syntax
- useState hook for managing notes data
- Event handling (onClick events for buttons)
- Props and component structure

#### TypeScript Fundamentals
- Basic types (string, number)
- Interfaces (Note interface)
- Type annotations for useState
- Type-only imports

#### Vite
- Project structure
- Development server (npm run dev)
- Hot Module Replacement (HMR)

#### CSS
- Flexbox (for layout)
- Basic styling (colors, margins, padding)
- CSS classes and selectors

### Quick Start Learning Path
1. Learn React components and useState hook
2. Understand TypeScript interfaces and type annotations
3. Practice basic CSS flexbox
4. Learn how to use the YouTube iframe API

## Features

- YouTube video player integration
- Add, edit, and delete timestamped notes
- Notes are associated with specific time ranges in the video
- Clean and intuitive user interface

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd video-notes
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
video-notes/
├── src/                  # Source code
│   ├── App.tsx          # Main application component
│   ├── App.css          # Styles
│   ├── types/           # TypeScript type definitions
│   │   └── Note.ts      # Note type definition
│   └── ...
├── public/              # Static assets
├── package.json         # Project dependencies and scripts
└── ...                  # Other configuration files
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Technologies Used

- React
- TypeScript
- Vite
- CSS

## License

MIT
