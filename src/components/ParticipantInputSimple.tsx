'use client'

import { useState, useEffect, useRef } from 'react'
import { Participant } from '@/types'
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useToast } from '@/hooks/useToast'
import ToastContainer from './ToastContainer'

interface ParticipantInputProps {
  initialParticipants: Participant[]
  onCalculate: (participants: Participant[]) => void
  onBack: () => void
}

export default function ParticipantInputSimple({ 
  initialParticipants, 
  onCalculate, 
  onBack 
}: ParticipantInputProps) {
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants.length > 0 
      ? initialParticipants 
      : [{ id: '1', name: '', amount: 0 }, { id: '2', name: '', amount: 0 }]
  )
  const [isLoading, setIsLoading] = useState(false)
  
  const { toasts, showSuccess, showError, removeToast } = useToast()

  // Auto-save to localStorage
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (participants.some(p => p.name.trim() || p.amount >= 0)) {
        localStorage.setItem('bagirata-draft', JSON.stringify({
          participants,
          timestamp: Date.now()
        }))
      }
    }, 1000)

    return () => clearTimeout(autoSave)
  }, [participants])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('bagirata-draft')
    if (draft && initialParticipants.length === 0) {
      try {
        const parsed = JSON.parse(draft)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setParticipants(parsed.participants)
        }
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }, [])

  const addParticipant = () => {
    const newId = Date.now().toString()
    const newParticipant = { id: newId, name: '', amount: 0 }
    setParticipants([...participants, newParticipant])
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id))
      showSuccess('Peserta dihapus')
    } else {
      showError('Minimal 2 peserta diperlukan')
    }
  }

  const updateParticipant = (id: string, field: 'name' | 'amount', value: string | number) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value }
      }
      return p
    }))

    // Check for duplicate names
    if (field === 'name' && value) {
      const duplicates = participants.filter(p => p.id !== id && p.name.toLowerCase() === (value as string).toLowerCase())
      if (duplicates.length > 0) {
        showError('Nama sudah digunakan oleh peserta lain')
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleAmountInput = (id: string, value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    const numberValue = numericValue ? parseInt(numericValue) : 0
    updateParticipant(id, 'amount', numberValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validParticipants = participants.filter(p => 
      p.name.trim() && p.amount >= 0
    )
    
    if (validParticipants.length < 2) {
      showError('Minimal 2 peserta dengan nama dan jumlah yang valid')
      return
    }
    
    setIsLoading(true)
    
    setTimeout(() => {
      localStorage.removeItem('bagirata-draft')
      onCalculate(validParticipants)
      setIsLoading(false)
    }, 800)
  }

  const totalAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="animate-slideUp space-y-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
          disabled={isLoading}
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
        <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border animate-scaleIn shadow-sm">
          <div className="text-center space-y-2">
            <p className="text-3xl font-medium text-light-text dark:text-dark-text">
              {formatCurrencyFull(totalAmount)}
            </p>
            <p className="text-sm text-light-muted dark:text-dark-muted">
              {formatCurrencyFull(totalAmount / participants.length)} per orang
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {participants.map((participant, index) => (
            <div key={participant.id} className="animate-slideIn bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-light-muted dark:text-dark-muted font-medium uppercase tracking-wider">
                  Peserta {index + 1}
                </span>
                {participants.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className="p-1 text-light-muted dark:text-dark-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Jumlah (Rupiah)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-light-muted dark:text-dark-muted">Rp</span>
                    <input
                      type="text"
                      placeholder="0"
                      value={participant.amount ? formatCurrency(participant.amount) : ''}
                      onChange={(e) => handleAmountInput(participant.id, e.target.value)}
                      className="w-full p-3 pl-10 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted transition-all"
                      disabled={isLoading}
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
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Tambah Peserta</span>
        </button>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg py-4 px-6 rounded-2xl text-base font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                Menghitung...
              </div>
            ) : (
              'Hitung Bagi Rata'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}