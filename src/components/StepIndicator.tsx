'use client'

import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: 'landing' | 'input' | 'results'
}

const steps = [
  { key: 'landing', label: 'Mulai', number: 1 },
  { key: 'input', label: 'Input', number: 2 },
  { key: 'results', label: 'Hasil', number: 3 }
]

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep)
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div key={step.key} className="flex items-center">
              {/* Step Circle */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
                ${isCompleted 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : isCurrent 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted'
                }
              `}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>

              {/* Step Label */}
              <span className={`
                ml-2 text-sm font-medium transition-colors
                ${isCurrent 
                  ? 'text-light-text dark:text-dark-text' 
                  : 'text-light-muted dark:text-dark-muted'
                }
              `}>
                {step.label}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-0.5 ml-4 transition-colors
                  ${index < currentIndex 
                    ? 'bg-green-600' 
                    : 'bg-light-border dark:bg-dark-border'
                  }
                `} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}