// models/topic.model.js
// Importamos la conexión a la DB
import db from '../db/index.js';

// Preparamos los statements (mejor performance y seguridad)
// crea una sentencia preparada (prepared statement), Una sentencia preparada es como “guardar” una consulta SQL lista para ejecutar varias veces sin volver a compilarla
const stmtAll     = db.prepare(`SELECT * FROM topics ORDER BY votes DESC, datetime(created_at) DESC, id DESC`);
const stmtById    = db.prepare(`SELECT * FROM topics WHERE id = ?`);
const stmtInsert  = db.prepare(`INSERT INTO topics (title, description, link) VALUES (?, ?, ?)`);
const stmtVoteUp  = db.prepare(`UPDATE topics SET votes = votes + 1 WHERE id = ?`);
const stmtVoteDown= db.prepare(`UPDATE topics SET votes = MAX(votes - 1, 0) WHERE id = ?`); // evita negativos
const stmtDelete  = db.prepare(`DELETE FROM topics WHERE id = ?`);
const stmtUpdate = db.prepare(`UPDATE topics SET title = ?, description = ?, link = ? WHERE id = ?`); // Actualiza título y descripción por id

// Función: obtener todos
export function getAllTopics() {
  // all() devuelve un array de filas
  return stmtAll.all();
}

// Función: obtener uno por id
export function getTopicById(id) {
  // get() devuelve una sola fila o undefined
  return stmtById.get(id);
}

// Función: crear nuevo topic
export function createTopic({ title, description, link }) {
  // run() ejecuta INSERT/UPDATE/DELETE, devuelve info (lastInsertRowid, changes)
  // si description es null o undefined, usar '' (string vacío)
  const info = stmtInsert.run(title, description ?? '', link ?? '');
  return info.lastInsertRowid; // devolvemos el id del creado
}

// Función: votar (up/down)
export function voteTopic(id, dir = 'up') {
  if (dir === 'down') {
    stmtVoteDown.run(id);
  } else {
    stmtVoteUp.run(id);
  }
  return getTopicById(id); // devolvemos el topic actualizado
}

// Función: eliminar
export function deleteTopic(id) {
  const info = stmtDelete.run(id);
  return info.changes > 0; // true si eliminó algo
}

// Función: actualizar un topic existente
export function updateTopic(id, title, description, link) {
  stmtUpdate.run(title, description, link, id); // Guarda cambios
}