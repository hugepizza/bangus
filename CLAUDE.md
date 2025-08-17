# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Bangus (Milkfish) Farming Profit Calculator** built with Next.js 15, React 19, and TypeScript. It's a financial calculator app that helps farmers calculate costs, revenue, and net profit for a 4-month bangus farming cycle.

## Commands

```bash
# Development
npm run dev          # Start development server with Turbopack at localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint for code linting
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4 with App Router
- **Language**: TypeScript with strict mode enabled
- **UI Components**: shadcn/ui components (New York style)
- **Styling**: Tailwind CSS v4 with CSS variables
- **State Management**: React useState hooks (client-side)

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
  - `page.tsx` - Main calculator interface (client component)
  - `model.ts` - Business logic for profit calculations
  - `globals.css` - Global styles and Tailwind imports
  
- `/src/components/ui/` - shadcn/ui components (Button, Card, Input, Label, Slider)
- `/src/lib/utils.ts` - Utility functions including `cn()` for className merging

### Key Implementation Details

1. **Client-Side Rendering**: The main page (`src/app/page.tsx`) uses `"use client"` directive for interactive calculator functionality

2. **Calculation Model**: Core business logic in `src/app/model.ts:calculateBangusProfit()` handles:
   - Feed conversion ratio (FCR) calculations
   - Natural vs commercial feed ratios
   - Cost breakdowns (feed, labor, rent, fingerlings)
   - Revenue and profit calculations

3. **Component Library**: Uses shadcn/ui with imports via `@/components/ui/*` alias

4. **Path Aliases**: TypeScript configured with `@/*` mapping to `./src/*`

5. **Internationalization**: Currency formatting uses Chinese locale (`zh-CN`) with PHP currency

## Development Notes

- The app is a single-page calculator with no routing or backend requirements
- All calculations happen client-side in real-time as users adjust inputs
- Uses Slider components for percentage-based inputs (survival rate, natural feed ratio)
- Includes visual profit indicators and optimization tips based on calculated metrics