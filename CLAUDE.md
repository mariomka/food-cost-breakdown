# Project Guidelines

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

**IMPORTANT: Use one-line commit messages only**

- Keep messages concise and descriptive
- Use lowercase and imperative mood (e.g., "add recipe calculator feature")

### Testing

- Unit tests using Vitest
- Test composables and utility functions
- Component testing for complex UI logic
- Run tests with: `npm run test`
- Aim for meaningful test coverage on business logic

**Test Conventions:**

- Colocate tests: Place test files next to the source files they test
- Use `.test.ts` suffix
- Use `data-test` attributes for querying elements in tests

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Vitest
- ESLint
- Prettier
- Vue I18n
- shadcn-vue
- Tailwind CSS v4

### Internationalization (i18n)

The project uses Vue I18n with the Composition API for multi-language support (English/Spanish).

**Configuration:**

- i18n setup: `src/i18n/index.ts`
- Translation files: `src/i18n/locales/en.ts` and `src/i18n/locales/es.ts`
- Browser language detection is enabled (falls back to English)

**Usage in components:**

- Use the Composition API with `useI18n()` in the script setup
- In templates, use the `t()` function: `{{ t('key.name') }}`

### UI Components (shadcn-vue)

The project uses shadcn-vue for accessible, customizable UI components built on top of Radix Vue and styled with Tailwind CSS v4.

**Usage:**

- Install components using: `npx shadcn-vue@latest add [component-name]`
- Import components from `@/components/ui/`
