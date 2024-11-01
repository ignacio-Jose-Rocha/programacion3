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
import routerEstadisticas from './routes/estadisticas.js';
import routerInforme from './routes/informe.js'
import redis from 'redis';
import passport from "passport";
import initializePassport from './config/passportConfig.js';
import autorizarUsuario from './middleware/autorizarUsuario.js';
import contentTypeMiddleware from './middleware/contentTypeMiddleware.js';


// Cargar variables de entorno
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

// Inicializa Passport
initializePassport(passport);
app.use(passport.initialize());

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
app.use(contentTypeMiddleware);


// Middleware para analizar JSON
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/auth', authRouter);  
app.use('/clientes', routerCliente);
app.use('/admins', passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerAdmin);
app.use('/reclamoOficinas', passport.authenticate('jwt', { session: false }), autorizarUsuario([2]), routerReclamoOficina);
app.use('/reclamos', passport.authenticate('jwt', { session: false }), autorizarUsuario([3]), routerReclamo);  
app.use('/reclamoTipos', passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerReclamoTipo);  
app.use('/oficinas', passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerOficina);  
app.use('/estadisticas', passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerEstadisticas); 
app.use('/informes', routerInforme); 


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