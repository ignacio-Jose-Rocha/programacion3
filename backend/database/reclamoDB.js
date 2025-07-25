import pool from './config.js';

const ReclamoDB = {
  obtenerReclamosDB: async () => {
    try {
      const [reclamos] = await pool.query("SELECT * FROM reclamos");
      return reclamos;
    } catch (error) {
      console.error("Error al obtener reclamos de la base de datos:", error);
      throw error;
    }
  },

  obtenerReclamoPorClienteYReclamoDB: async (idCliente, idReclamo) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM reclamos WHERE idUsuarioCreador = ? AND idReclamo = ?",
        [idCliente, idReclamo]
      );
      return rows[0];
    } catch (error) {
      console.error("Error al obtener reclamo por cliente y reclamo:", error);
      throw error;
    }
  },

  obtenerEstadoReclamoPorId: async (idEstado) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM reclamosEstado WHERE idReclamoEstado = ?",
        [idEstado]
      );
      return rows[0];
    } catch (error) {
      console.error("Error al obtener estado de reclamo:", error);
      throw error;
    }
  },

  buscarReclamoPorUsuarioYAsuntoDB: async (idUsuario, asunto) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM reclamos WHERE idUsuarioCreador = ? AND asunto = ?",
        [idUsuario, asunto]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error al buscar reclamo por usuario y asunto:", error);
      throw error;
    }
  },

  crearReclamoDB: async (reclamo) => {
    try {
      const [result] = await pool.query(
        "INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador) VALUES (?, ?, ?, ?, ?, ?)",
        [reclamo.asunto, reclamo.descripcion, reclamo.fechaCreado, reclamo.idReclamoEstado, reclamo.idReclamoTipo, reclamo.idUsuarioCreador]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear reclamo:", error);
      throw error;
    }
  },

  obtenerReclamosPorUsuarioDB: async (idUsuario) => {
    try {
      const [rows] = await pool.query(
        "SELECT r.*, re.descripcion as estadoDescripcion, rt.descripcion as tipoDescripcion FROM reclamos r LEFT JOIN reclamosEstado re ON r.idReclamoEstado = re.idReclamoEstado LEFT JOIN reclamosTipo rt ON r.idReclamoTipo = rt.idReclamoTipo WHERE r.idUsuarioCreador = ?",
        [idUsuario]
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener reclamos por usuario:", error);
      throw error;
    }
  },

  cancelarReclamoDB: async (idCliente, idReclamo) => {
    try {
      const [result] = await pool.query(
        "UPDATE reclamos SET idReclamoEstado = 3 WHERE idUsuarioCreador = ? AND idReclamo = ?",
        [idCliente, idReclamo]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al cancelar reclamo:", error);
      throw error;
    }
  }
};

export default ReclamoDB;
