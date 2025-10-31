"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReceiptModalProps {
  receipt: {
    orderId: number
    total: number
    timestamp: string
    message: string
    items: any[]
  }
}

export default function ReceiptModal({ receipt }: ReceiptModalProps) {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-bold text-foreground">#{receipt.orderId}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-medium">{new Date(receipt.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Time</span>
              <span className="font-medium">{new Date(receipt.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold">Total Amount</span>
              <span className="text-lg font-bold text-primary">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">{receipt.message}</p>
          </div>

          <div className="space-y-2">
            <Link href="/" className="block">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
              Print Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
