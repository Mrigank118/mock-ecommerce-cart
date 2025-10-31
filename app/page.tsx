"use client"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import { useCart } from "@/hooks/use-cart"

export default function Home() {
  const { cartCount } = useCart()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">ShopHub</h1>
          <Link href="/cart">
            <Button variant="outline" className="relative bg-transparent">
              <ShoppingCart className="w-5 h-5" />
              <span className="ml-2">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to ShopHub</h2>
          <p className="text-lg opacity-90">Discover amazing products at great prices</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Products</h2>
        <ProductGrid />
      </section>
    </main>
  )
}
