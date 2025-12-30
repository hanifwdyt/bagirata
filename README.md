# Bagirata 🧮

Aplikasi web untuk membagi biaya kelompok secara adil dan efisien. Dirancang khusus untuk situasi nongkrong bareng teman-teman dimana orang yang berbeda membayar jumlah yang berbeda, dan perlu dihitung siapa yang harus transfer ke siapa.

## Fitur Utama

- **Perhitungan Otomatis**: Menghitung pembagian biaya secara adil dengan algoritma debt simplification
- **Minimal Transfer**: Mengoptimalkan jumlah transaksi yang diperlukan untuk settlement
- **Dark/Light Mode**: Mendukung tema gelap dan terang dengan preferensi yang tersimpan
- **Auto-Save**: Otomatis menyimpan draft ke localStorage
- **Share ke WhatsApp**: Langsung kirim hasil perhitungan ke grup WhatsApp
- **Responsive Design**: Tampil sempurna di mobile dan desktop
- **Real-time Currency**: Format mata uang Rupiah secara real-time

## Contoh Use Case

Misalnya BBQ bareng teman:
- Andi bayar daging Rp 150.000
- Budi bayar bumbu Rp 50.000  
- Cika bayar charcoal Rp 75.000
- Doni bayar minuman Rp 100.000

Total: Rp 375.000, rata-rata Rp 93.750 per orang.

Bagirata akan menghitung:
- Andi terima: Rp 56.250 dari Budi + Cika
- Doni terima: Rp 6.250 dari Cika

## Tech Stack

- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling dengan custom color palette
- **Lucide React** - Icon library
- **Google Fonts (Lora)** - Typography

## Getting Started

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open browser**
```
http://localhost:3000
```

## Struktur Project

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles & Tailwind
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/          # React components
│   ├── LandingPage.tsx           # Landing page
│   ├── ParticipantInputSimple.tsx # Form input peserta
│   ├── ExpenseResults.tsx        # Hasil perhitungan
│   ├── ThemeToggle.tsx          # Theme switcher
│   ├── ToastContainer.tsx       # Toast notifications
│   └── StepIndicator.tsx        # Progress indicator
├── contexts/           # React contexts
│   └── ThemeContext.tsx        # Theme management
├── hooks/              # Custom hooks
│   └── useToast.ts             # Toast notifications
├── types/              # TypeScript definitions
│   └── index.ts                # Type definitions
└── utils/              # Utility functions
    ├── calculator.ts           # Debt simplification algorithm
    └── storage.ts              # localStorage helpers
```

## Algoritma Debt Simplification

Aplikasi menggunakan algoritma khusus untuk meminimalkan jumlah transaksi yang diperlukan:

1. Hitung selisih setiap orang dari rata-rata
2. Pisahkan yang minus (harus bayar) dan plus (harus terima)
3. Matching optimal untuk mengurangi kompleksitas transaksi
4. Hasil: Minimal transfer dengan settlement yang efisien

## Design System

Terinspirasi dari PomoDo dengan:
- **Font**: Lora (Google Fonts)
- **Color Palette**: Minimalist light/dark theme
- **Animations**: Subtle micro-interactions
- **Layout**: Card-based, mobile-first

## Deployment

Build for production:
```bash
npm run build
npm start
```

Deploy ke Vercel (recommended):
```bash
vercel --prod
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use for personal or commercial projects.

## Author

Dibuat dengan ❤️ oleh [Hanif](https://hanif.app)

---

🧮 **Bagirata** - Karena hidup udah ribet, jangan bikin ribet lagi soal bagi-bagi biaya!
