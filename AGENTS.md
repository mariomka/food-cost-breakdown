# Food Cost Breakdown - Project Guidelines

## Project Overview

Food Cost Breakdown (Calculadora de Escandallos) is a web application for calculating food costs and recipe profitability. This tool helps restaurants, chefs, and food businesses break down the cost of their dishes by analyzing individual ingredient costs, portions, and pricing.

## Architecture

### Client-Side Only Application

This application runs entirely in the browser without requiring a backend server. All application state and data (recipes, ingredients, costs, etc.) are persisted in local storage to maintain state across sessions. When users return to the application, all their data will be automatically restored from local storage.

### Project Structure

The project is organized following Vue 3 best practices:

- **Components**: Reusable UI components are located in `src/components/`
  - Keep components focused and single-responsibility
  - Use composition API with `<script setup>`
  - Props and emits should be properly typed

- **Composables**: Shared reactive logic is extracted into composables in `src/composables/`
  - Follow the `use*` naming convention (e.g., `useRecipe`, `useIngredients`)
  - Composables should be pure and reusable
  - Handle state management and business logic

- **Views**: Page-level components in `src/views/`

- **Types**: TypeScript type definitions in `src/types/`

## Development Guidelines

### Git Commits

- Use one-line commit messages
- Keep messages concise and descriptive
- Use lowercase and imperative mood (e.g., "add recipe calculator feature")

### Code Quality

#### Testing

- Unit tests using Vitest
- Test composables and utility functions
- Component testing for complex UI logic
- Run tests with: `npm run test`
- Aim for meaningful test coverage on business logic

#### Linting

The project uses multiple linting tools:

- **Oxlint**: Fast linter for correctness checks
  - Run with: `npm run lint:oxlint`
  - Focuses on correctness issues

- **ESLint**: JavaScript/TypeScript linting
  - Run with: `npm run lint`
  - Enforces code style and best practices

- **Prettier**: Code formatting
  - Automatic formatting for consistent code style
  - Should be integrated with your editor

## Tech Stack

- Vue 3 with Composition API
- TypeScript for type safety
- Vite for build tooling
- Vitest for testing
- Oxlint + ESLint for linting
- Prettier for formatting
- Vue I18n for internationalization

### Internationalization (i18n)

The project uses Vue I18n with global injection enabled for multi-language support (English/Spanish).

**Configuration:**
- i18n setup: `src/i18n/index.ts`
- Translation files: `src/i18n/locales/en.ts` and `src/i18n/locales/es.ts`
- Browser language detection is enabled (falls back to English)

**Usage in components:**
- Use `$t()` directly in templates: `{{ $t('key.name') }}`
- Do NOT use the composition API (`useI18n()`)

## Feature Requirements

- Create and manage recipes with multiple ingredients
- Calculate cost per portion/serving
- Calculate profit margins and suggested selling prices
- Multi-language support (English/Spanish)
- All data persisted in browser storage
