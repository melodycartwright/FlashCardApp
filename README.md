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
