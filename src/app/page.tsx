'use client'

import { useState, useEffect } from 'react'
import { Participant, ExpenseSummary } from '@/types'
import { calculateExpenseSplit } from '@/utils/calculator'
import { saveSession, loadSession } from '@/utils/storage'
import LandingPage from '@/components/LandingPage'
import ParticipantInputSimple from '@/components/ParticipantInputSimple'
import ExpenseResults from '@/components/ExpenseResults'

type Step = 'landing' | 'input' | 'results'

export default function BagirataApp() {
  const [step, setStep] = useState<Step>('landing')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [results, setResults] = useState<ExpenseSummary | null>(null)

  useEffect(() => {
    const saved = loadSession()
    if (saved && saved.participants.length > 0) {
      setParticipants(saved.participants)
      setStep('input')
    }
  }, [])

  const handleStart = () => {
    setStep('input')
  }

  const handleCalculate = (participantList: Participant[]) => {
    setParticipants(participantList)
    saveSession({
      participants: participantList,
      timestamp: Date.now()
    })
    const calculated = calculateExpenseSplit(participantList)
    setResults(calculated)
    setStep('results')
  }

  const handleReset = () => {
    setParticipants([])
    setResults(null)
    setStep('landing')
  }

  const handleEdit = () => {
    setStep('input')
  }

  return (
    <main className="min-h-screen flex flex-col lg:justify-center">
      <div className="w-full max-w-2xl mx-auto px-6 py-8 lg:py-12">
        {step === 'landing' && <LandingPage onStart={handleStart} />}
        {step === 'input' && (
          <ParticipantInputSimple
            initialParticipants={participants}
            onCalculate={handleCalculate}
            onBack={() => setStep('landing')}
          />
        )}
        {step === 'results' && results && (
          <ExpenseResults
            results={results}
            onEdit={handleEdit}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  )
}