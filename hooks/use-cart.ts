"use client"

import { useCallback } from "react"
import useSWR from "swr"

interface CartItem {
  id: number
  productId: number
  quantity: number
  name: string
  price: number
  image: string
  subtotal: number
}

interface Cart {
  items: CartItem[]
  total: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCart() {
  const { data, error, mutate } = useSWR<Cart>("/api/cart", fetcher, {
    revalidateOnFocus: false,
  })

  const cart = data || { items: [], total: 0 }
  const loading = !data && !error

  const addToCart = useCallback(
    async (productId: number, quantity: number) => {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        })
        if (response.ok) {
          mutate()
        }
      } catch (error) {
        console.error("Error adding to cart:", error)
      }
    },
    [mutate],
  )

  const removeFromCart = useCallback(
    async (itemId: number) => {
      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
        })
        if (response.ok) {
          mutate()
        }
      } catch (error) {
        console.error("Error removing from cart:", error)
      }
    },
    [mutate],
  )

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    cartCount,
  }
}
