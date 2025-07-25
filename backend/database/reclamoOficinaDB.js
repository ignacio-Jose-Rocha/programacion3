import pool from './config.js';

const ReclamoOficinaDB = {
    obtenerReclamosOficinaDB: async (idUsuario) => {
        try {
            const [rows] = await pool.query(`
                SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado,
                       re.descripcion as estado, rt.descripcion as tipo,
                       CONCAT(u.nombre, ' ', u.apellido) as cliente
                FROM reclamos r
                JOIN reclamosEstado re ON r.idReclamoEstado = re.idReclamoEstado
                JOIN reclamosTipo rt ON r.idReclamoTipo = rt.idReclamoTipo
                JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
                JOIN usuariosOficinas uo ON uo.idUsuario = ?
                JOIN oficinas o ON uo.idOficina = o.idOficina
                WHERE rt.idReclamoTipo = o.idReclamoTipo
                AND r.idReclamoEstado IN (1, 2)
                ORDER BY r.fechaCreado ASC
            `, [idUsuario]);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener reclamos de oficina: ' + error.message);
        }
    },

    verificarEmpleadoPuedeAtenderDB: async (idReclamo, idUsuario) => {
        try {
            const [rows] = await pool.query(`
                SELECT COUNT(*) as puede
                FROM reclamos r
                JOIN reclamosTipo rt ON r.idReclamoTipo = rt.idReclamoTipo
                JOIN oficinas o ON rt.idReclamoTipo = o.idReclamoTipo
                JOIN usuariosOficinas uo ON o.idOficina = uo.idOficina
                WHERE r.idReclamo = ? AND uo.idUsuario = ?
            `, [idReclamo, idUsuario]);
            return rows[0].puede > 0;
        } catch (error) {
            throw new Error('Error al verificar permisos: ' + error.message);
        }
    },

    actualizarEstadoReclamoDB: async (idReclamo, nuevoEstado) => {
        try {
            await pool.query(
                'UPDATE reclamos SET idReclamoEstado = ? WHERE idReclamo = ?',
                [nuevoEstado, idReclamo]
            );
        } catch (error) {
            throw new Error('Error al actualizar estado: ' + error.message);
        }
    },

    finalizarReclamoDB: async (idReclamo, idUsuario) => {
        try {
            await pool.query(
                'UPDATE reclamos SET idReclamoEstado = 4, idUsuarioFinalizador = ?, fechaFinalizado = NOW() WHERE idReclamo = ?',
                [idUsuario, idReclamo]
            );
        } catch (error) {
            throw new Error('Error al finalizar reclamo: ' + error.message);
        }
    },

    obtenerReclamoPorIdDB: async (idReclamo) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM reclamos WHERE idReclamo = ?',
                [idReclamo]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener reclamo: ' + error.message);
        }
    },

    obtenerEstadoDescripcionDB: async (idEstado) => {
        try {
            const [rows] = await pool.query(
                'SELECT descripcion FROM reclamosEstado WHERE idReclamoEstado = ?',
                [idEstado]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener descripción de estado: ' + error.message);
        }
    }
};

export default ReclamoOficinaDB;