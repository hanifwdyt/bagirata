import ThemeToggle from './ThemeToggle'
import { Calculator } from 'lucide-react'

interface LandingPageProps {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="animate-fadeIn">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center mb-16">
        <div></div>
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="text-center space-y-12">
        {/* Hero section */}
        <div className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-dark-card">
              <Calculator className="w-8 h-8 text-gray-600 dark:text-dark-muted" />
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-normal text-light-text dark:text-dark-text tracking-tight">
            Bagirata
          </h1>
          
          <p className="text-lg text-light-muted dark:text-dark-muted max-w-sm mx-auto leading-relaxed font-normal">
            Hitung bagi rata expenses dengan mudah. Tidak ada lagi kebingungan siapa bayar berapa.
          </p>
        </div>
        
        {/* CTA */}
        <div className="space-y-6">
          <button
            onClick={onStart}
            className="w-full bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg py-4 px-6 rounded-2xl text-base font-medium hover:opacity-90 transition-all duration-200 animate-scaleIn"
          >
            Mulai Hitung
          </button>
          
          <p className="text-sm text-light-muted dark:text-dark-muted font-normal">
            Data disimpan lokal di browser Anda
          </p>
        </div>
      </div>
    </div>
  )
}