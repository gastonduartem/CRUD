// db/index.js
// Importamos better-sqlite3 y utilidades de 
// A diferencia de sqlite3 (la librería más clásica), better-sqlite3 trabaja de forma sincrónica, Eso significa que podés hacer consultas y obtener el resultado directo, sin callbacks ni async/await
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenemos __dirname de este archivo (index.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Armamos la ruta absoluta del archivo de base de datos (db/data.sqlite)
const dbPath = path.join(__dirname, 'data.sqlite'); // ← dentro de /db

// Creamos/abrimos la base de datos
const db = new Database(dbPath); // Si no existe, la crea

// Creamos la tabla "topics" si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    votes INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Exportamos la conexión (para usar en models)
export default db;
