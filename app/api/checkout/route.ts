import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/db"
import { getSessionId } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const { name, email, items, total } = await request.json()

    if (!name || !email || !items || items.length === 0 || !total) {
      return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 })
    }

    const db = await getDb()

    // Create order
    const result = db
      .prepare(`
      INSERT INTO orders (sessionId, name, email, total, items)
      VALUES (?, ?, ?, ?, ?)
    `)
      .run(sessionId, name, email, total, JSON.stringify(items))

    // Clear cart
    db.prepare("DELETE FROM cart_items WHERE sessionId = ?").run(sessionId)

    return NextResponse.json({
      success: true,
      orderId: Math.floor(Math.random() * 1000000),
      total,
      timestamp: new Date().toISOString(),
      message: `Order confirmed! A confirmation email will be sent to ${email}`,
    })
  } catch (error) {
    console.error("Error during checkout:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
