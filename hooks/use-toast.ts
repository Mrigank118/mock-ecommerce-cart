"use client"

import { useState, useCallback } from "react"

export function useToast() {
  const [toasts, setToasts] = useState<
    { id: number; title: string; description?: string }[]
  >([])

  const showToast = useCallback((title: string, description?: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return { showToast, toasts }
}
