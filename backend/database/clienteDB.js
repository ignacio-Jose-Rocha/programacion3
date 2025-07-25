import pool from './config.js';

const ClienteDB = {
    buscarUsuarioDB: async (correoElectronico, nombre, apellido) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM usuarios WHERE correoElectronico = ? OR (nombre = ? AND apellido = ?)',
                [correoElectronico, nombre, apellido]
            );
            return rows;
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            throw error;
        }
    },

    crearUsuarioDB: async (usuario) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario.nombre, usuario.apellido, usuario.correoElectronico, usuario.contrasenia, usuario.idTipoUsuario, usuario.imagen, usuario.activo]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }
};

export default ClienteDB;
