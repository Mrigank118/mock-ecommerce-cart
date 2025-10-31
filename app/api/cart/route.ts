import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/db"
import { getSessionId } from "@/lib/session"

export async function GET() {
  try {
    const sessionId = await getSessionId()
    const db = await getDb()

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
      ORDER BY ci.createdAt
    `)
      .all(sessionId)

    const total = (items as any[]).reduce((sum, item) => sum + item.subtotal, 0)

    return NextResponse.json({ items, total: Number.parseFloat(total.toFixed(2)) })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const { productId, quantity } = await request.json()

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
    }

    const db = await getDb()

    // Check if product exists
    const product = db.prepare("SELECT id FROM products WHERE id = ?").get(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already in cart
    const existingItem = db
      .prepare("SELECT id, quantity FROM cart_items WHERE sessionId = ? AND productId = ?")
      .get(sessionId, productId)

    if (existingItem) {
      // Update quantity
      db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").run(quantity, (existingItem as any).id)
    } else {
      // Insert new item
      db.prepare("INSERT INTO cart_items (sessionId, productId, quantity) VALUES (?, ?, ?)").run(
        sessionId,
        productId,
        quantity,
      )
    }

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
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
