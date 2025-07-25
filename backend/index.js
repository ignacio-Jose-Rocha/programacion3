import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import redis from 'redis';
import passport from "passport";
import initializePassport from './config/passportConfig.js';
import autorizarUsuario from './middleware/autorizarUsuario.js';
import contentTypeMiddleware from './middleware/contentTypeMiddleware.js';

// Importar rutas
import authRouter from './routes/authRoutes.js';
import routerCliente from './routes/clienteRoutes.js';
import routerAdmin from './routes/adminRoutes.js';
import routerReclamoOficina from './routes/reclamoOficinaRoutes.js';
import routerReclamo from './routes/reclamoRoutes.js';
import routerReclamoTipo from './routes/reclamoTipoRoutes.js';
import routerOficina from './routes/oficinaRoutes.js';
import routerEstadisticas from './routes/estadisticas.js';
import routerInforme from './routes/informe.js';
import routerReportes from './routes/reportesRoutes.js';
import routerNotificaciones from './routes/notificacionesRoutes.js';
import routerReclamosEstado from './routes/reclamosEstadoRoutes.js';
import routerUsuariosOficinas from './routes/usuariosOficinasRoutes.js';
import routerUsuarios from './routes/usuariosRoutes.js';
import routerUsuariosTipo from './routes/usuariosTipoRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta base de la API
const API_VERSION = '/api/v1';

// Definir __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Redis
const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

redisClient.connect().catch(err => {
  console.error('Error al conectar a Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conectado a Redis');
});

redisClient.on('error', (err) => {
  console.error('Error en Redis:', err);
});

// Inicializa Passport
initializePassport(passport);
app.use(passport.initialize());

// Configurar middlewares
app.use(cors({ origin: 'http://localhost:5173' }));  // Permitir solo este origen
app.use(contentTypeMiddleware);                       // Verificar Content-Type application/json
app.use(express.json());                              // Analizar JSON
app.use(morgan('dev'));                               // Logger para desarrollo

// Configurar rutas con el prefijo de versión
app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/clientes`, routerCliente);
app.use(`${API_VERSION}/admins`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerAdmin);
app.use(`${API_VERSION}/reclamoOficinas`, passport.authenticate('jwt', { session: false }), autorizarUsuario([2]), routerReclamoOficina);
app.use(`${API_VERSION}/reclamos`, passport.authenticate('jwt', { session: false }), autorizarUsuario([3]), routerReclamo);
app.use(`${API_VERSION}/reclamoTipos`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerReclamoTipo);
app.use(`${API_VERSION}/oficinas`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerOficina);
app.use(`${API_VERSION}/estadisticas`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerEstadisticas);
app.use(`${API_VERSION}/informes`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerInforme);
app.use(`${API_VERSION}/reportes`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerReportes);
app.use(`${API_VERSION}/notificaciones`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1, 2]), routerNotificaciones);
app.use(`${API_VERSION}/reclamosEstado`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerReclamosEstado);
app.use(`${API_VERSION}/usuariosOficinas`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerUsuariosOficinas);
app.use(`${API_VERSION}/usuarios`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerUsuarios);
app.use(`${API_VERSION}/usuariosTipo`, passport.authenticate('jwt', { session: false }), autorizarUsuario([1]), routerUsuariosTipo);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// servir archivos estáticos desde uploads -> imagenes de usuarios
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
