"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import ProductDetailModal from "./product-detail-modal"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load products"
        setError(errorMsg)
        alert("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleImageClick = (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-48 bg-muted" />
            <CardContent className="space-y-2 pt-4">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader
              className="p-0 overflow-hidden bg-muted h-48 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(product)}
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
              <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
              <p className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                onClick={() => {
                  addToCart(product.id, 1)
                  alert(`${product.name} added to your cart`)
                }}
                className="w-full"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <ProductDetailModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
