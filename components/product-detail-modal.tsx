"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description?: string
}

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addToCart } = useCart()

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product.id, 1)
    alert(`${product.name} added to your cart`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden h-96">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <p className="text-3xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
              <p className="text-foreground leading-relaxed">
                {product.description || "High-quality product with excellent features."}
              </p>
            </div>
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
