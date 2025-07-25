import pool from './config.js';

const oficinas = {
    getAllOficinasDB: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM oficinas WHERE activo = 1');
            return rows;
        } catch (error) {
            console.error('Error al obtener oficinas:', error);
            throw error;
        }
    }
};

export default oficinas;