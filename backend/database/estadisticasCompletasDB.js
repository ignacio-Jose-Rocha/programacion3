import pool from './config.js';

const EstadisticasDB = {
    obtenerEstadisticasCompletas: async () => {
        try {
            const [rows] = await pool.query(`
                CALL sp_estadisticas_completas()
            `);
            return rows[0];
        } catch (error) {
            // Si no existe el SP, usar consulta normal
            const [totalReclamos] = await pool.query('SELECT COUNT(*) as total FROM reclamos');
            const [reclamosPendientes] = await pool.query('SELECT COUNT(*) as pendientes FROM reclamos WHERE idReclamoEstado = 1');
            const [reclamosFinalizados] = await pool.query('SELECT COUNT(*) as finalizados FROM reclamos WHERE idReclamoEstado = 4');
            
            return [{
                totalReclamos: totalReclamos[0].total,
                reclamosPendientes: reclamosPendientes[0].pendientes,
                reclamosFinalizados: reclamosFinalizados[0].finalizados
            }];
        }
    },

    obtenerEstadisticasPorTipo: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT rt.descripcion as tipo, COUNT(r.idReclamo) as cantidad
                FROM reclamosTipo rt
                LEFT JOIN reclamos r ON rt.idReclamoTipo = r.idReclamoTipo
                GROUP BY rt.idReclamoTipo, rt.descripcion
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener estadísticas por tipo: ' + error.message);
        }
    },

    obtenerEstadisticasPorEstado: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT re.descripcion as estado, COUNT(r.idReclamo) as cantidad
                FROM reclamosEstado re
                LEFT JOIN reclamos r ON re.idReclamoEstado = r.idReclamoEstado
                GROUP BY re.idReclamoEstado, re.descripcion
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener estadísticas por estado: ' + error.message);
        }
    }
};

export default EstadisticasDB;