// routes/topic.routes.js
// Importamos Router de Express y los controllers
import { Router } from 'express';
import {
  listTopics,
  showNewForm,
  createTopicHandler,
  voteTopicHandler,
  deleteTopicHandler
} from '../controllers/topic.controller.js';

// Creamos router
const router = Router();

// Definimos rutas REST simples
router.get('/', listTopics);                   // GET /topics        → listar
router.get('/new', showNewForm);               // GET /topics/new    → formulario
router.post('/', createTopicHandler);          // POST /topics       → crear
router.post('/:id/vote', voteTopicHandler);    // POST /topics/:id/vote?dir=up|down → votar
router.post('/:id/delete', deleteTopicHandler);// POST /topics/:id/delete          → eliminar

// Exportamos el router para usarlo en app.js
export default router;
