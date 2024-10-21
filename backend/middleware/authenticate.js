import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = decoded; // Guardar la información del usuario en `req.user`
    next(); // Continuar con la ejecución
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

export default authenticate;
