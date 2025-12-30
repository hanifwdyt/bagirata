# BAGIRATA - Expense Splitting App

## Project Overview
Next.js app untuk menyelesaikan masalah split bill/patungan grup dengan algoritma debt simplification.

## User Flow
1. **Landing Page** - Deskripsi singkat app + tombol "Start"
2. **Input Participants** - Form untuk nama + jumlah yang dibayar
3. **Review & Edit** - List semua input dengan opsi edit/hapus
4. **Results** - Tampilan siapa bayar ke siapa berapa

## Key Features
- **Add/remove participants** dengan mudah
- **Edit mode** untuk koreksi input
- **Summary section** (total expense + rata-rata)
- **Copy/share results** untuk grup chat
- **Local storage** untuk save session
- **Debt simplification algorithm**
- **Mobile-first design**
- **Multiple calculation types** (bagi rata + custom split)

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Local Storage untuk persistence
- Responsive design

## File Structure
```
/app (App Router)
/components (reusable UI)
/utils (calculation logic)
/types (TypeScript interfaces)
```

## Implementation Plan
1. Initialize Next.js with TypeScript
2. Set up Tailwind CSS
3. Create project structure
4. Define TypeScript types
5. Build components step by step
6. Implement calculation algorithm
7. Add local storage & sharing features