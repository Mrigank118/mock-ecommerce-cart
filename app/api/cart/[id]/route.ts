import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/db"
import { getSessionId } from "@/lib/session"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = await getSessionId()
    const { id } = await params
    const db = await getDb()

    // Verify the item belongs to this session
    const item = db.prepare("SELECT id FROM cart_items WHERE id = ? AND sessionId = ?").get(id, sessionId)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Delete the item
    db.prepare("DELETE FROM cart_items WHERE id = ?").run(id)

    // Return updated cart
    const items = db
      .prepare(`
      SELECT 
        ci.id,
        ci.productId,
        ci.quantity,
        p.name,
        p.price,
        p.image,
        (p.price * ci.quantity) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.productId = p.id
      WHERE ci.sessionId = ?
    `)
      .all(sessionId)

    const total = (items as any[]).reduce((sum, item) => sum + item.subtotal, 0)

    return NextResponse.json({ items, total: Number.parseFloat(total.toFixed(2)) })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
