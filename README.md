# NutriFlux

A Next.js food tracking app built with Tailwind CSS.

## Features

- Add foods with quantity, calories, protein, carbs, and fat
- AI-style nutrition suggestions for common foods
- Daily totals update automatically
- Clean responsive UI built with Tailwind CSS
- Data is saved locally in the browser

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Project structure

- `src/app/page.tsx` contains the main food tracker UI
- `src/app/layout.tsx` provides the root layout and global styles
- `src/app/globals.css` imports Tailwind directives

## Customize

- Update `src/app/page.tsx` to expand the `nutritionDatabase`
- Add a real AI API integration for richer food suggestions
- Add meal categories, charts, or weekly summaries as future enhancements
