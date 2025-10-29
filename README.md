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

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Setup environment variables:**

   ```bash
   # Copy environment templates
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env

   # Edit apps/server/.env and change JWT_SECRET to a secure value
   ```

3. **Start development servers:**
   ```bash
   pnpm dev    # Starts both web and server in parallel
   ```

## Environment Setup

### Required Environment Variables

**Server** (`apps/server/.env`):

- `JWT_SECRET` - **MUST be changed** from "replace_me" to a secure secret
- `MONGODB_URI` - MongoDB connection string (default: local MongoDB)
- `PORT` - Server port (default: 4000)
- `CLIENT_ORIGIN` - Frontend URL for CORS (default: http://localhost:5173)

**Web** (`apps/web/.env`):

- `VITE_API_URL` - Backend API URL (default: http://localhost:4000)

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

## Continuous Integration

This project uses GitHub Actions for automated CI/CD:

### CI Pipeline (`.github/workflows/ci.yml`)

Runs on every pull request and push to main branch:

1. **Setup** - Node.js 20, pnpm cache, install dependencies
2. **Lint** - ESLint across all workspaces (`pnpm lint`)
3. **Test** - Unit tests across all workspaces (`pnpm test`)
4. **Build** - Build all apps and packages (`pnpm build`)

### Branch Protection

- All PRs must pass CI checks before merging
- Direct pushes to main branch also trigger CI
- Red/green status checks visible on every PR

### Local CI Testing

```bash
# Run the same checks locally before pushing
pnpm lint   # Check code style
pnpm test   # Run tests
pnpm build  # Verify builds work
```
