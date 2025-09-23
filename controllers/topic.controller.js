// controllers/topic.controller.js
// Importamos funciones del modelo
import {
  getAllTopics,
  createTopic,
  voteTopic,
  deleteTopic,
  getTopicById
} from '../models/topic.model.js';

// Listar topics → renderiza views/index.ejs
export function listTopics(req, res) {
  const topics = getAllTopics();               // Traemos todos
  return res.render('index', {                 // Renderiza views/index.ejs
    title: 'CRUD Challenge',
    topics                                   // Enviamos siempre un array (aunque sea vacío)
  });
}

// Mostrar formulario de "nuevo" → renderiza views/topics/new.ejs
export function showNewForm(req, res) {
  return res.render('topics/new', {           // Ruta relativa respecto de /views
    title: 'Nuevo Topic'
  });
}

// Crear nuevo topic (POST /topics)
export function createTopicHandler(req, res) {
  const { title, description } = req.body;    // Tomamos campos del form
  // trim: Elimina los espacios en blanco al inicio y al final de un string
  if (!title || title.trim() === '') {        // Validación mínima
    return res.status(400).send('El título es obligatorio');
  }
  createTopic({ title: title.trim(), description: (description || '').trim() });
  return res.redirect('/topics');             // Volvemos al listado
}

// Votar (POST /topics/:id/vote?dir=up|down)
export function voteTopicHandler(req, res) {
  const { id } = req.params;                  // id en la URL
  const { dir } = req.query;                  // ?dir=up|down
  const topic = getTopicById(Number(id));     // Verificamos que exista
  if (!topic) return res.status(404).send('Topic no encontrado');
  voteTopic(Number(id), dir === 'down' ? 'down' : 'up');
  return res.redirect('/topics');
}

// Eliminar (POST /topics/:id/delete)
export function deleteTopicHandler(req, res) {
  const { id } = req.params;
  const ok = deleteTopic(Number(id));
  if (!ok) return res.status(404).send('Topic no encontrado');
  return res.redirect('/topics');
}
