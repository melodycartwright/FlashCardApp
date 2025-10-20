# Flashcards Monorepo

A modern flashcard application built with the MERN stack using pnpm workspaces.

## Monorepo Overview

This repository is organized as a monorepo with the following structure:

### Apps

- `apps/web` - React frontend with Vite and Tailwind CSS
- `apps/server` - Express.js backend with MongoDB

### Packages

- `packages/ui` - Shared UI components
- `packages/utils` - Shared utility functions
- `packages/config` - Shared configuration
- `packages/types` - Shared type definitions

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

## Scripts

- `pnpm dev` - Start all development servers in parallel
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm test` - Run tests across all packages and apps
- `pnpm format` - Format code across all packages and apps

## Code Quality

This project uses consistent linting and formatting across all workspaces:

### Linting
- **ESLint v9** with flat config format
- Shared configuration in `packages/config/eslint/base.cjs`
- React and React Hooks rules enabled
- Run: `pnpm lint` (all packages) or `pnpm --filter @flashcards/web lint` (specific package)

### Formatting
- **Prettier** with shared configuration
- Configuration in `packages/config/prettier.config.cjs`
- Run: `pnpm format` (all packages) or `pnpm --filter @flashcards/web format` (specific package)

### Configuration
- Each workspace inherits from shared configs in `packages/config/`
- Individual `eslint.config.cjs` files reference the base configuration
- Consistent rules across frontend, backend, and shared packages
