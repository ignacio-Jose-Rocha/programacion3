import pool from './config.js';

const ReclamosTipo = {
    getAllReclamosTipoDB: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM reclamosTipo WHERE activo = 1');
            return rows;
        } catch (error) {
            console.error('Error al obtener tipos de reclamos:', error);
            throw error;
        }
    }
};

export default ReclamosTipo;
