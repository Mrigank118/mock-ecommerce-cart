"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import CheckoutForm from "@/components/checkout-form"
import ReceiptModal from "@/components/receipt-modal"

interface Receipt {
  orderId: number
  total: number
  timestamp: string
  message: string
  items: any[]
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  const handleCheckout = async (formData: { name: string; email: string }) => {
    setLoading(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart.items,
          total: cart.total,
        }),
      })

      if (!response.ok) throw new Error("Checkout failed")

      const data = await response.json()
      setReceipt({
        orderId: data.orderId,
        total: data.total,
        timestamp: data.timestamp,
        message: data.message,
        items: cart.items,
      })

      toast({
        title: "Success",
        description: "Order placed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Checkout failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (receipt) {
    return <ReceiptModal receipt={receipt} />
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/cart" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <CheckoutForm onSubmit={handleCheckout} loading={loading} />

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
