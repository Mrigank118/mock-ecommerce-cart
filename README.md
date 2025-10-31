# 🛒 Mock E-Commerce Cart

A simple **full-stack shopping cart** built using **Next.js**, **TypeScript**, and **SQLite** for the **Vibe Commerce Full Stack Coding Assignment**.

---

## 🚀 Overview

This app lets users:
- Browse mock products  
- Add or remove items from the cart  
- View total dynamically  
- Checkout with name and email  
- Get a mock receipt (no real payments)

---

## ⚙️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** SQLite (`sql.js`)  
- **UI:** Shadcn/UI + Lucide Icons  

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/products` | Get all mock products |
| POST | `/api/cart` | Add `{ productId, qty }` |
| DELETE | `/api/cart/:id` | Remove product from cart |
| GET | `/api/cart` | Get cart and total |
| POST | `/api/checkout` | Mock checkout (returns receipt) |

---

## 🖥️ Features

- Responsive product grid  
- Add / remove items from cart  
- Dynamic total calculation  
- Simple checkout form  
- Receipt modal with timestamp  

---

## 🛠️ Setup

```bash
git clone https://github.com/<your-username>/cart-m.git
cd cart-m
npm install
npm run dev
Then open http://localhost:3000

💾 Database

Uses a local SQLite file (data/ecommerce.db) for storing mock data.
No external setup needed.