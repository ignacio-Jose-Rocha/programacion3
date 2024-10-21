import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import routerCliente from './routes/clienteRoutes.js';
import routerAdmin from './routes/adminRoutes.js';
import routerReclamoOficina from './routes/reclamoOficinaRoutes.js';
import routerReclamo from './routes/reclamoRoutes.js';
import routerReclamoTipo from './routes/reclamoTipoRoutes.js'
import routerOficina from './routes/oficinaRoutes.js';
import redis from 'redis';


// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

// Conectar al servidor Redis
redisClient.connect().catch(err => {
  console.error('Error al conectar a Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conectado a Redis');
});

// Manejar errores
redisClient.on('error', (err) => {
  console.error('Error en Redis:', err);
});

// Configurar CORS para permitir solicitudes solo desde el frontend
app.use(cors({
  origin: 'http://localhost:5173', // Permite solo este origen
}));

// Middleware para verificar que el Content-Type sea application/json
app.use((req, res, next) => {
  // Si es un método GET o OPTIONS, permitimos la solicitud
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next();
  }

  // Aseguramos que req.body esté definido y sea un objeto
  const hasBody = req.body && Object.keys(req.body).length > 0;

  // Si hay cuerpo y el Content-Type no es application/json ni application/pdf, retornamos error
  if (hasBody && req.headers['content-type'] !== 'application/json' && req.headers['content-type'] !== 'application/pdf') {
    return res.status(400).json({ error: 'El Content-Type debe ser application/json o application/pdf' });
  }

  // Continuamos con el siguiente middleware
  next();
});


// Middleware para analizar JSON
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/auth', authRouter);  // Ruta para autenticación
app.use('/clientes', routerCliente);
app.use('/admins', routerAdmin);
app.use('/reclamoOficinas', routerReclamoOficina);
app.use('/reclamos', routerReclamo);  
app.use('/reclamoTipos', routerReclamoTipo);  
app.use('/oficinas', routerOficina);  

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error en el servidor');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

export default redisClient;