# Food Cost Breakdown / Calculadora de Escandallos

A client-side web application for calculating food costs and recipe profitability. Helps restaurants, chefs, and food businesses break down the cost of dishes by analyzing individual ingredient costs, portions, and pricing.

All data is stored in localStorage — no backend required.

## Features

- Add and manage ingredients with prices, quantities, and units
- Create recipes with multiple ingredients and portion sizes
- Live cost calculations: total cost, cost per serving, suggested price from target margin
- Bilingual support (English / Spanish) with automatic browser language detection
- Responsive layout: split-screen on desktop, tabbed on mobile
- Data persists across sessions via localStorage

## Tech Stack

Vue 3 + TypeScript + Vite + Tailwind CSS v4 + shadcn-vue + Vue I18n + Vitest

## Setup

```sh
npm install
npm run dev
```

## Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start dev server                    |
| `npm run build`  | Type-check and build for production |
| `npm run test`   | Run unit tests                      |
| `npm run lint`   | Lint with ESLint + oxlint           |
| `npm run format` | Format with Prettier                |
