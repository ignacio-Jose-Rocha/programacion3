import pool from './config.js';

export const getUserById = async (idUsuario) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
};

export const getUserByEmail = async (correoElectronico) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error;
    }
};
