"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CartItems from "@/components/cart-items"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { cart, loading } = useCart()

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-foreground">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItems />
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
