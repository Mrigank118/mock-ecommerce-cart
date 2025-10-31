import initSqlJs, { type Database as SqlJsDatabase } from "sql.js"
import fs from "fs"
import path from "path"

let db: SqlJsDatabase | null = null
let SQL: any = null

const DB_PATH = path.join(process.cwd(), "data", "ecommerce.db")

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load database from file or create new one
async function loadDb(): Promise<SqlJsDatabase> {
  if (!SQL) {
    const wasmPath = path.join(process.cwd(), "public", "sql-wasm.wasm")
    SQL = await initSqlJs({
      locateFile: () => wasmPath,
    })
  }

  ensureDataDir()

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    return new SQL.Database(buffer)
  }

  // If file does not exist, create new DB
  return new SQL.Database()
}

// Save database to file
function saveDb(database: SqlJsDatabase) {
  ensureDataDir()
  const data = database.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buffer)
}

// Wrapper class for SQL.js
class DbWrapper {
  private database: SqlJsDatabase

  constructor(database: SqlJsDatabase) {
    this.database = database
  }

  prepare(sql: string) {
    const db = this.database
    return {
      run: (...params: any[]) => {
        db.run(sql, params)
        saveDb(db)
        return { changes: db.getRowsModified() }
      },
      get: (...params: any[]) => {
        const stmt = db.prepare(sql)
        stmt.bind(params)
        let row
        if (stmt.step()) {
          row = stmt.getAsObject()
        }
        stmt.free()
        return row
      },
      all: (...params: any[]) => {
        const stmt = db.prepare(sql)
        stmt.bind(params)
        const results: any[] = []
        while (stmt.step()) {
          results.push(stmt.getAsObject())
        }
        stmt.free()
        return results
      },
    }
  }

  run(sql: string, params?: any[]) {
    this.database.run(sql, params || [])
    saveDb(this.database)
  }

  exec(sql: string) {
    this.database.run(sql)
    saveDb(this.database)
  }
}

export async function getDb() {
  if (!db) {
    db = await loadDb()
    initializeDb()
  }
  return new DbWrapper(db)
}

// Initialize tables
function initializeDb() {
  if (!db) return

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      externalId INTEGER UNIQUE,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      total REAL NOT NULL,
      items TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  saveDb(db)
}
