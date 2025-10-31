"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
import ProductDetailModal from "./product-detail-modal"

export default function CartItems() {
  const { cart, removeFromCart } = useCart()
  const { toast } = useToast()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
      toast({
        title: "Removed",
        description: "Item removed from cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleImageClick = (item: any) => {
    setSelectedProduct({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category || "Product",
    })
    setModalOpen(true)
  }

  return (
    <>
      <div className="space-y-4">
        {cart.items.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageClick(item)}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                  <p className="text-lg font-bold text-primary mt-2">${item.subtotal.toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProductDetailModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
