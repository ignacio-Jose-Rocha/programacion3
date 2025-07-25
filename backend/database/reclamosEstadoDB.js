import pool from './config.js';

const ReclamosEstadoDB = {
    getAllEstadosDB: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM reclamosEstado ORDER BY idReclamoEstado');
            return rows;
        } catch (error) {
            throw new Error('Error al obtener estados: ' + error.message);
        }
    },

    buscarEstadoPorDescripcionDB: async (descripcion) => {
        try {
            const [rows] = await pool.query('SELECT * FROM reclamosEstado WHERE descripcion = ?', [descripcion]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar estado: ' + error.message);
        }
    },

    crearEstadoDB: async (descripcion) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO reclamosEstado (descripcion) VALUES (?)',
                [descripcion]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear estado: ' + error.message);
        }
    },

    actualizarEstadoDB: async (idEstado, descripcion) => {
        try {
            await pool.query(
                'UPDATE reclamosEstado SET descripcion = ? WHERE idReclamoEstado = ?',
                [descripcion, idEstado]
            );
        } catch (error) {
            throw new Error('Error al actualizar estado: ' + error.message);
        }
    },

    eliminarEstadoDB: async (idEstado) => {
        try {
            await pool.query('DELETE FROM reclamosEstado WHERE idReclamoEstado = ?', [idEstado]);
        } catch (error) {
            throw new Error('Error al eliminar estado: ' + error.message);
        }
    }
};

export default ReclamosEstadoDB;