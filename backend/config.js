require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Usuario por defecto de MySQL en XAMPP
  password: 'manu.kayn123',  // Deja esto vacío si no has configurado una contraseña para root
  database: 'tpp3'  // Nombre de la base de datos que creaste en phpMyAdmin
});

// Conectar a MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta de ejemplo para consultar datos de la tabla
app.get('/datos', (req, res) => {
  db.query('SELECT * FROM nombre_de_tu_tabla', (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

// Configurar el servidor Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});