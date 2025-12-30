'use client'

import { useState } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: 'success' | 'error' | 'info', duration = 4000) => {
    const id = Date.now().toString()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => {
    addToast(message, 'success', duration)
  }

  const showError = (message: string, duration?: number) => {
    addToast(message, 'error', duration)
  }

  const showInfo = (message: string, duration?: number) => {
    addToast(message, 'info', duration)
  }

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    removeToast
  }
}