import pool from './config.js';

const ReclamosEstadoDB = {
    getAllReclamosEstadoDB: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT idReclamoEstado, descripcion, activo
                FROM reclamosEstado 
                WHERE activo = 1
                ORDER BY idReclamoEstado
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener estados de reclamos: ' + error.message);
        }
    },

    crearReclamoEstadoDB: async (descripcion) => {
        try {
            const [result] = await pool.query(`
                INSERT INTO reclamosEstado (descripcion, activo)
                VALUES (?, 1)
            `, [descripcion]);
            
            return {
                idReclamoEstado: result.insertId,
                descripcion,
                activo: 1
            };
        } catch (error) {
            throw new Error('Error al crear estado de reclamo: ' + error.message);
        }
    },

    actualizarReclamoEstadoDB: async (idReclamoEstado, descripcion) => {
        try {
            await pool.query(`
                UPDATE reclamosEstado 
                SET descripcion = ?
                WHERE idReclamoEstado = ?
            `, [descripcion, idReclamoEstado]);
            
            return {
                idReclamoEstado,
                descripcion
            };
        } catch (error) {
            throw new Error('Error al actualizar estado de reclamo: ' + error.message);
        }
    },

    borrarReclamoEstadoDB: async (idReclamoEstado) => {
        try {
            await pool.query(`
                UPDATE reclamosEstado 
                SET activo = 0
                WHERE idReclamoEstado = ?
            `, [idReclamoEstado]);
        } catch (error) {
            throw new Error('Error al eliminar estado de reclamo: ' + error.message);
        }
    }
};

export default ReclamosEstadoDB;