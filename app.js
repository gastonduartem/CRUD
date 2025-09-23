// app.js
// Importamos módulos externos necesarios
import express from 'express';                 // Framework web
import path from 'path';                       // Utilidades de rutas de archivos
import { fileURLToPath } from 'url';           // Para obtener __filename en ESM (type: module), ESM: sistema de módulos estándar de JavaScript

// Re-creamos __filename y __dirname porque en ESM no existen por defecto
const __filename = fileURLToPath(import.meta.url); // Ruta absoluta del archivo actual (app.js)
const __dirname = path.dirname(__filename);        // Carpeta de app.js

// Creamos la app de Express
const app = express();

// Configuramos EJS como motor de vistas | EJS: Embedded JavaScript, permite escribir HTML dinámico mezclado con JavaScript
app.set('view engine', 'ejs');                          // Motor de plantillas
app.set('views', path.join(__dirname, 'views'));        // Carpeta de vistas (en la raíz del proyecto)

// Middlewares para parsear body y servir estáticos, Cuando un cliente (ejemplo: un formulario en HTML o una app) envía datos al servidor, esos datos llegan en bruto (raw), El middleware de parsing convierte ese body en un objeto JavaScript
app.use(express.urlencoded({ extended: true }));        // Para leer <form> application/x-www-form-urlencoded
app.use(express.json());                                // Para leer JSON en el body
app.use(express.static(path.join(__dirname, 'public')));// Servir /public como estáticos (CSS, imágenes, etc.)

// Rutas de "topics"
import topicRoutes from './routes/topic.routes.js';     // Importamos las rutas definidas aparte
app.use('/topics', topicRoutes);                        // Prefijo /topics para esas rutas

// Ruta raíz: redirige a /topics (lista) | req = request (lo que manda el cliente), res = response (lo que responde tu servidor)
app.get('/', (req, res) => res.redirect('/topics'));

// Levantamos el servidor
const PORT = process.env.PORT || 3000;                  // Puerto configurable por variable de entorno
app.listen(PORT, () => {
  console.log(`✅ Server on http://localhost:${PORT}`);
});
