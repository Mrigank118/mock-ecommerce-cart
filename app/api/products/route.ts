import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

const FAKE_STORE_API = "https://fakestoreapi.com/products"

export async function GET() {
  try {
    const db = await getDb()

    // Check if we have products in DB
    const existingProducts = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number }

    if (existingProducts.count === 0) {
      // Fetch from Fake Store API
      const response = await fetch(FAKE_STORE_API)
      const fakeProducts = await response.json()

      // Insert into DB (limit to 10 products)
      const stmt = db.prepare(`
        INSERT INTO products (externalId, name, price, description, image, category)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      for (const product of fakeProducts.slice(0, 10)) {
        stmt.run(product.id, product.title, product.price, product.description, product.image, product.category)
      }
    }

    // Return products from DB
    const products = db.prepare("SELECT id, name, price, image, category FROM products ORDER BY id").all()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
