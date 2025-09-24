// controllers/topic.controller.js
// Importamos funciones del modelo
import {
  getAllTopics,
  createTopic,
  voteTopic,
  deleteTopic,
  getTopicById,
  updateTopic
} from '../models/topic.model.js';

// RENDERIZAR: tomar una plantilla (por ejemplo index.ejs) + datos (del servidor) → y transformarlos en HTML final que el navegador pueda mostrar, res.render() → usa un motor de plantillas (EJS en tu caso) para generar HTML dinámico a partir de una vista

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
  const { title, description, link } = req.body;    // Tomamos campos del form
  // trim: Elimina los espacios en blanco al inicio y al final de un string
  if (!title || title.trim() === '') {        // Validación mínima
    return res.status(400).send('El título es obligatorio');
  }
  createTopic({ title: title.trim(), description: (description || '').trim(), link: (link || '').trim() });
  console.log('BODY:', req.body);
  return res.redirect('/topics');             // Volvemos al listado
}

// Votar (POST /topics/:id/vote?dir=up|down)
export function voteTopicHandler(req, res) {
  // req.params → valores que vienen en la ruta (:id) | req.query → valores que vienen en el query string (?dir=up)
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

// GET '/topics/:id/edit' - Form de edición
export function showEditForm(req, res) {
  const { id } = req.params;        // toma id de la URL
  const topic = getTopicById(id);   // busca en DB
  if (!topic) return res.status(404).send('Topic no encontrado'); // 404 si no existe
  // Renderiza la vista 'topics/edit' con el topic cargado
  res.render('topics/edit', { title: 'Editar topic', topic });
}

// POST '/topics/:id/update' - Guardar cambios
export function updateTopicCtrl(req, res) {
  const { id } = req.params;                       // id de la URL
  const { title, description, link } = req.body;   // campos del form

  // trim para limpiar strings
  const t = (title ?? '').trim();
  const d = (description ?? '').trim();
  const l = (link ?? '').trim();

  updateTopic(Number(id), t, d, l);  // pasamos las constantes
  res.redirect('/topics');           // volvemos al listado
  console.log('BODY:', req.body);
}

// GET '/topics/:id' - Ver un topic puntual
export function showTopic(req, res) {
  const { id } = req.params;       // id en la URL
  const topic = getTopicById(id);  // busca
  if (!topic) return res.status(404).send('Topic no encontrado'); // 404 si no está
  // Podés crear una vista 'topics/show.ejs' si querés algo más lindo
  res.send(topic); // simple por ahora (JSON)
}