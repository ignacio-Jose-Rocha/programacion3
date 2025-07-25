import pool from './config.js';

const InformeDB = {
    buscarDatosReportePdf: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    r.asunto as reclamo,
                    rt.descripcion as tipo,
                    re.descripcion as estado,
                    DATE_FORMAT(r.fechaCreado, '%d/%m/%Y') as fechaCreado,
                    CONCAT(u.nombre, ' ', u.apellido) as cliente
                FROM reclamos r
                JOIN reclamosTipo rt ON r.idReclamoTipo = rt.idReclamoTipo
                JOIN reclamosEstado re ON r.idReclamoEstado = re.idReclamoEstado
                JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
                ORDER BY r.fechaCreado DESC
            `);
            return { reclamos: rows };
        } catch (error) {
            throw new Error('Error al obtener datos para reporte PDF: ' + error.message);
        }
    },

    buscarDatosReporteCsv: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    r.asunto as reclamo,
                    rt.descripcion as tipo,
                    re.descripcion as estado,
                    DATE_FORMAT(r.fechaCreado, '%d/%m/%Y') as fechaCreado,
                    CONCAT(u.nombre, ' ', u.apellido) as cliente
                FROM reclamos r
                JOIN reclamosTipo rt ON r.idReclamoTipo = rt.idReclamoTipo
                JOIN reclamosEstado re ON r.idReclamoEstado = re.idReclamoEstado
                JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
                ORDER BY r.fechaCreado DESC
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener datos para reporte CSV: ' + error.message);
        }
    }
};

export default InformeDB;
