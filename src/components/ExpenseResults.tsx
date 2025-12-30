'use client'

import { useState } from 'react'
import { ExpenseSummary } from '@/types'
import { clearSession } from '@/utils/storage'
import { ArrowLeft, Check, Copy, Share, Edit3, RotateCcw, Users, Receipt } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface ExpenseResultsProps {
  results: ExpenseSummary
  onEdit: () => void
  onReset: () => void
}

export default function ExpenseResults({ results, onEdit, onReset }: ExpenseResultsProps) {
  const [copied, setCopied] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const generateShareText = () => {
    let text = `🧮 BAGIRATA - Hasil Bagi Rata

📊 RINGKASAN:
• Total Expense: ${formatCurrency(results.totalExpense)}
• Rata-rata per orang: ${formatCurrency(results.averagePerPerson)}

👥 YANG BAYAR:`
    
    results.participants.forEach(p => {
      text += `\n• ${p.name}: ${formatCurrency(p.amount)}`
    })
    
    if (results.transactions.length > 0) {
      text += `\n\n💸 SIAPA BAYAR KE SIAPA:`
      results.transactions.forEach(t => {
        text += `\n• ${t.from} → ${t.to}: ${formatCurrency(t.amount)}`
      })
    } else {
      text += `\n\n✅ Udah lunas semua! Ga ada yang hutang 🎉`
    }
    
    text += `\n\n---\nDihitung pakai Bagirata 🧮\nhttps://hanif.app/bagirata`
    
    return text
  }

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(generateShareText())
    const whatsappUrl = `https://wa.me/?text=${text}`
    window.open(whatsappUrl, '_blank')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleReset = () => {
    clearSession()
    onReset()
  }

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          <h1 className="text-xl font-medium text-light-text dark:text-dark-text">Hasil Perhitungan</h1>
        </div>
        <ThemeToggle />
      </div>

      {/* Total Summary */}
      <div className="text-center space-y-4 py-6">
        <div className="space-y-2">
          <p className="text-4xl lg:text-5xl font-medium text-light-text dark:text-dark-text">
            {formatCurrency(results.totalExpense)}
          </p>
          <p className="text-base text-light-muted dark:text-dark-muted">
            {formatCurrency(results.averagePerPerson)} per orang
          </p>
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        {/* Who Paid Card */}
        <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border animate-slideUp">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-light-muted dark:text-dark-muted" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text uppercase tracking-wide">
              Yang Bayar
            </h3>
          </div>
          <div className="space-y-4">
            {results.participants.map((participant, index) => (
              <div key={participant.id} className="flex justify-between items-center py-2 animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                <span className="text-base font-medium text-light-text dark:text-dark-text">{participant.name}</span>
                <span className="text-base font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(participant.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement Card */}
        {results.transactions.length > 0 ? (
          <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <ArrowLeft className="w-5 h-5 text-light-muted dark:text-dark-muted rotate-180" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text uppercase tracking-wide">
                Settlement
              </h3>
            </div>
            <div className="space-y-4">
              {results.transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center py-2 animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <span className="text-base font-medium text-light-text dark:text-dark-text">
                    {transaction.from} → {transaction.to}
                  </span>
                  <span className="text-base font-semibold text-green-600 dark:text-green-400">{formatCurrency(transaction.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-light-card dark:bg-dark-card rounded-2xl p-8 border border-light-border dark:border-dark-border text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xl font-medium text-light-text dark:text-dark-text mb-2">Sudah Lunas</p>
            <p className="text-sm text-light-muted dark:text-dark-muted">Tidak ada yang perlu dibayar</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 animate-slideUp pt-4">
        <button
          onClick={shareToWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-2xl text-base font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          <Share className="w-5 h-5" />
          Kirim ke WhatsApp
        </button>
        
        <button
          onClick={copyToClipboard}
          className="w-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text dark:text-dark-text py-4 px-6 rounded-2xl text-base font-medium hover:bg-light-bg dark:hover:bg-dark-bg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Text
            </>
          )}
        </button>
        
        <div className="flex gap-4 pt-2">
          <button
            onClick={onEdit}
            className="flex-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text dark:text-dark-text py-4 px-6 rounded-2xl font-medium hover:bg-light-bg dark:hover:bg-dark-bg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text dark:text-dark-text py-4 px-6 rounded-2xl font-medium hover:bg-light-bg dark:hover:bg-dark-bg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}