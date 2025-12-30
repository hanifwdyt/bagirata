'use client'

import { useState, useEffect, useRef } from 'react'
import { Participant } from '@/types'
import { ArrowLeft, Plus, Trash2, Users, Check, AlertCircle, Zap } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useToast } from '@/hooks/useToast'
import ToastContainer from './ToastContainer'

interface ParticipantInputProps {
  initialParticipants: Participant[]
  onCalculate: (participants: Participant[]) => void
  onBack: () => void
}

interface ValidationState {
  [key: string]: {
    name: boolean
    amount: boolean
  }
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000]

export default function ParticipantInputEnhanced({ 
  initialParticipants, 
  onCalculate, 
  onBack 
}: ParticipantInputProps) {
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants.length > 0 
      ? initialParticipants 
      : [{ id: '1', name: '', amount: 0 }, { id: '2', name: '', amount: 0 }]
  )
  const [validation, setValidation] = useState<ValidationState>({})
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()
  const nameRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const amountRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Auto-save to localStorage
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (participants.some(p => p.name.trim() || p.amount > 0)) {
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
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          setParticipants(parsed.participants)
          showInfo('Draft data telah dimuat dari sesi sebelumnya')
        }
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }, [])

  const validateParticipant = (participant: Participant) => {
    const nameValid = participant.name.trim().length > 0
    const amountValid = participant.amount > 0
    
    return { nameValid, amountValid }
  }

  // Separate validation update function
  const updateValidation = (participantId: string, nameValid: boolean, amountValid: boolean) => {
    setValidation(prev => {
      const current = prev[participantId]
      if (current?.name === nameValid && current?.amount === amountValid) {
        return prev // No change, prevent re-render
      }
      return {
        ...prev,
        [participantId]: {
          name: nameValid,
          amount: amountValid
        }
      }
    })
  }

  const addParticipant = () => {
    const newId = Date.now().toString()
    const newParticipant = { id: newId, name: '', amount: 0 }
    setParticipants([...participants, newParticipant])
    
    // Auto-focus new participant name field
    setTimeout(() => {
      nameRefs.current[newId]?.focus()
    }, 100)
    
    showSuccess('Peserta baru ditambahkan')
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id))
      setValidation(prev => {
        const newValidation = { ...prev }
        delete newValidation[id]
        return newValidation
      })
      showInfo('Peserta dihapus')
    } else {
      showError('Minimal 2 peserta diperlukan')
    }
  }

  const updateParticipant = (id: string, field: 'name' | 'amount', value: string | number) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value }
        const { nameValid, amountValid } = validateParticipant(updated)
        
        // Update validation separately to prevent infinite loop
        setTimeout(() => {
          updateValidation(id, nameValid, amountValid)
        }, 0)
        
        return updated
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
    // Remove non-numeric characters and format
    const numericValue = value.replace(/[^\d]/g, '')
    const numberValue = numericValue ? parseInt(numericValue) : 0
    updateParticipant(id, 'amount', numberValue)
  }

  const handlePresetAmount = (id: string, amount: number) => {
    updateParticipant(id, 'amount', amount)
    showSuccess(`Jumlah diset ke ${formatCurrencyFull(amount)}`)
  }

  const splitEqually = () => {
    const totalAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0)
    if (totalAmount > 0) {
      const equalAmount = Math.round(totalAmount / participants.length)
      setParticipants(participants.map(p => ({ ...p, amount: equalAmount })))
      showSuccess('Jumlah dibagi sama rata')
    } else {
      showError('Masukkan total amount terlebih dahulu')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validParticipants = participants.filter(p => {
      const { nameValid, amountValid } = validateParticipant(p)
      return nameValid && amountValid
    })
    
    if (validParticipants.length < 2) {
      showError('Minimal 2 peserta dengan nama dan jumlah yang valid')
      return
    }

    // Check for duplicate names
    const names = validParticipants.map(p => p.name.toLowerCase())
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
    if (duplicates.length > 0) {
      showError('Terdapat nama peserta yang sama')
      return
    }
    
    setIsLoading(true)
    showInfo('Menghitung bagi rata...')
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      localStorage.removeItem('bagirata-draft') // Clear draft after successful calculation
      onCalculate(validParticipants)
      setIsLoading(false)
      showSuccess('Perhitungan selesai!')
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent, participantId: string, field: 'name' | 'amount') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentIndex = participants.findIndex(p => p.id === participantId)
      
      if (field === 'name') {
        // Move to amount field of same participant
        amountRefs.current[participantId]?.focus()
      } else {
        // Move to name field of next participant or add new one
        if (currentIndex < participants.length - 1) {
          const nextParticipant = participants[currentIndex + 1]
          nameRefs.current[nextParticipant.id]?.focus()
        } else {
          addParticipant()
        }
      }
    }
  }

  const totalAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0)
  const validCount = participants.filter(p => {
    const nameValid = p.name.trim().length > 0
    const amountValid = p.amount > 0
    return nameValid && amountValid
  }).length

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
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
            {validCount}/{participants.length}
          </span>
        </div>
        
        <ThemeToggle />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={splitEqually}
          disabled={totalAmount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          Bagi Rata
        </button>
      </div>

      {/* Total Summary Card */}
      {totalAmount > 0 && (
        <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border animate-scaleIn shadow-sm hover:shadow-md transition-shadow">
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
          {participants.map((participant, index) => {
            const isValid = validation[participant.id]
            const nameValid = isValid?.name ?? false
            const amountValid = isValid?.amount ?? false
            
            return (
              <div key={participant.id} className="animate-slideIn bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-all transform hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-light-muted dark:text-dark-muted font-medium uppercase tracking-wider">
                      Peserta {index + 1}
                    </span>
                    {nameValid && amountValid && (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
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
                  <div className="relative">
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Nama
                      {!nameValid && participant.name.length > 0 && (
                        <span className="text-red-500 text-xs ml-1">*diperlukan</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        ref={el => nameRefs.current[participant.id] = el}
                        type="text"
                        placeholder="Masukkan nama"
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                        onFocus={() => setFocusedField(`${participant.id}-name`)}
                        onBlur={() => setFocusedField(null)}
                        onKeyPress={(e) => handleKeyPress(e, participant.id, 'name')}
                        className={`w-full p-3 pr-10 bg-light-bg dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted transition-all ${
                          nameValid ? 'border-green-400 dark:border-green-600' : 
                          participant.name && !nameValid ? 'border-red-400 dark:border-red-600' :
                          'border-light-border dark:border-dark-border'
                        }`}
                        disabled={isLoading}
                      />
                      {participant.name && (
                        <div className="absolute right-3 top-3">
                          {nameValid ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Jumlah (Rupiah)
                      {!amountValid && participant.amount > 0 && (
                        <span className="text-red-500 text-xs ml-1">*harus > 0</span>
                      )}
                    </label>
                    
                    {/* Preset Amount Buttons */}
                    <div className="flex gap-2 mb-3">
                      {PRESET_AMOUNTS.map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handlePresetAmount(participant.id, amount)}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          disabled={isLoading}
                        >
                          {amount / 1000}k
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-light-muted dark:text-dark-muted">Rp</span>
                      <input
                        ref={el => amountRefs.current[participant.id] = el}
                        type="text"
                        placeholder="0"
                        value={participant.amount ? formatCurrency(participant.amount) : ''}
                        onChange={(e) => handleAmountInput(participant.id, e.target.value)}
                        onFocus={() => setFocusedField(`${participant.id}-amount`)}
                        onBlur={() => setFocusedField(null)}
                        onKeyPress={(e) => handleKeyPress(e, participant.id, 'amount')}
                        className={`w-full p-3 pl-10 pr-10 bg-light-bg dark:bg-dark-bg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted transition-all ${
                          amountValid ? 'border-green-400 dark:border-green-600' : 
                          participant.amount > 0 && !amountValid ? 'border-red-400 dark:border-red-600' :
                          'border-light-border dark:border-dark-border'
                        }`}
                        disabled={isLoading}
                      />
                      {participant.amount > 0 && (
                        <div className="absolute right-3 top-3">
                          {amountValid ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={addParticipant}
          className="w-full py-4 px-6 bg-light-card dark:bg-dark-card border-2 border-dashed border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 rounded-2xl flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Tambah Peserta</span>
        </button>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-4 px-6 rounded-2xl text-base font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isLoading 
                ? 'bg-blue-600 text-white' 
                : 'bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg hover:opacity-90'
            }`}
            disabled={validCount < 2 || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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