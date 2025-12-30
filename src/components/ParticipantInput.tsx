'use client'

import { useState } from 'react'
import { Participant } from '@/types'
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface ParticipantInputProps {
  initialParticipants: Participant[]
  onCalculate: (participants: Participant[]) => void
  onBack: () => void
}

export default function ParticipantInput({ 
  initialParticipants, 
  onCalculate, 
  onBack 
}: ParticipantInputProps) {
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants.length > 0 
      ? initialParticipants 
      : [{ id: '1', name: '', amount: 0 }, { id: '2', name: '', amount: 0 }]
  )

  const addParticipant = () => {
    const newId = Date.now().toString()
    setParticipants([...participants, { id: newId, name: '', amount: 0 }])
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id))
    }
  }

  const updateParticipant = (id: string, field: 'name' | 'amount', value: string | number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validParticipants = participants.filter(p => 
      p.name.trim() && p.amount > 0
    )
    
    if (validParticipants.length < 2) {
      alert('Minimal 2 orang yang valid (nama + jumlah > 0)')
      return
    }
    
    onCalculate(validParticipants)
  }

  const totalAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="animate-slideUp space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          <h1 className="text-xl font-medium text-light-text dark:text-dark-text">Input Peserta</h1>
        </div>
        
        <ThemeToggle />
      </div>

      {/* Total Summary Card */}
      {totalAmount > 0 && (
        <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border animate-scaleIn">
          <div className="text-center space-y-2">
            <p className="text-3xl font-medium text-light-text dark:text-dark-text">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-sm text-light-muted dark:text-dark-muted">
              {formatCurrency(totalAmount / participants.length)} per orang
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {participants.map((participant, index) => (
            <div key={participant.id} className="animate-slideIn bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-light-muted dark:text-dark-muted font-medium uppercase tracking-wider">
                    Peserta {index + 1}
                  </span>
                </div>
                {participants.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className="p-1 text-light-muted dark:text-dark-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Nama
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama"
                    value={participant.name}
                    onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                    className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Jumlah (Rupiah)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-light-muted dark:text-dark-muted">Rp</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={participant.amount || ''}
                      onChange={(e) => updateParticipant(participant.id, 'amount', Number(e.target.value))}
                      className="w-full p-3 pl-10 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted transition-all"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addParticipant}
          className="w-full py-4 px-6 bg-light-card dark:bg-dark-card border-2 border-dashed border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Tambah Peserta</span>
        </button>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg py-4 px-6 rounded-2xl text-base font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed animate-scaleIn"
            disabled={participants.filter(p => p.name.trim() && p.amount > 0).length < 2}
          >
            Hitung Bagi Rata
          </button>
        </div>
      </form>
    </div>
  )
}