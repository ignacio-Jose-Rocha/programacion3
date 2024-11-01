import pool from '../config.js'; // Asegúrate de que la ruta a tu pool sea correcta

const ReclamoDB = {
  obtenerReclamosDB: async () => {
    try {
      const [reclamos] = await pool.query("SELECT * FROM reclamos");
      return reclamos; // Retornar los reclamos obtenidos
    } catch (error) {
      console.error("Error al obtener reclamos de la base de datos:", error);
      throw error; // Lanza el error para que el servicio lo maneje
    }
  },

  // Verifica si existe un reclamo para un usuario específico con el mismo asunto
  buscarReclamoPorUsuarioYAsuntoDB: async (idUsuarioCreador, asunto) => {
    try {
      const [result] = await pool.query(
        `SELECT 
          (SELECT COUNT(*) FROM reclamos WHERE idUsuarioCreador=? AND asunto=?) AS existeReclamo,
          (SELECT idTipoUsuario FROM usuarios WHERE idUsuario=?) AS idTipoUsuario`,
        [idUsuarioCreador, asunto, idUsuarioCreador]
      );
      return result[0];
    } catch (error) {
      throw new Error(
        "Error al buscar el reclamo por usuario y asunto: " + error.message
      );
    }
  },

  // Función para crear un reclamo y devolver el ID del nuevo reclamo
  crearReclamoDB: async (reclamoData) => {
    try {
      const [result] = await pool.query(
        "INSERT INTO reclamos SET ?",
        reclamoData
      );
      return result.insertId;
    } catch (error) {
      throw new Error("Error al crear el reclamo: " + error.message);
    }
  },


  // Función para obtener un reclamo por idCliente y idReclamo
  obtenerReclamoPorClienteYReclamoDB: async (idCliente, idReclamo) => {
    try {
      const [[reclamo]] = await pool.query(`
        SELECT r.asunto, r.idReclamo, r.idReclamoEstado, r.idReclamoTipo, u.correoElectronico, u.nombre, o.idOficina
        FROM reclamos r
        JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
        JOIN reclamosTipo rt ON r.idReclamoTipo = rt.idReclamoTipo
        JOIN oficinas o ON rt.idReclamoTipo = o.idReclamoTipo
        WHERE r.idReclamo = ? AND r.idUsuarioCreador = ?`, [idReclamo, idCliente]);
      return reclamo;
    } catch (error) {
      throw new Error('Error al obtener el reclamo: ' + error.message);
    }
  },

  // Cancela un reclamo asignando un nuevo estado (cancelado) al reclamo
  cancelarReclamoDB: async (idCliente, idReclamo) => {
    try {
      await pool.query(
        "UPDATE reclamos SET fechaCancelado = NOW(), idReclamoEstado=3 WHERE idUsuarioCreador = ? AND idReclamo=?",
        [idCliente, idReclamo]
      );
    } catch (error) {
      throw new Error("Error al cancelar el reclamo: " + error.message);
    }
  },

  // Obtiene todos los reclamos hechos por un usuario específico
  obtenerReclamosPorUsuarioDB: async (idUsuario) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.idReclamo, r.asunto, r.idReclamoEstado, rE.descripcion
        FROM reclamos r
        JOIN reclamosestado rE ON r.idReclamoEstado = rE.idReclamoEstado
        where idUsuarioCreador=?`,
        [idUsuario]
      );
      return rows;
    } catch (error) {
      throw new Error(
        "Error al obtener los reclamos del usuario: " + error.message
      );
    }
  },

 
  // obtiene el estado de reclamo por idEstado
  obtenerEstadoReclamoPorId: async (idEstado) => {
    const [[estado]] = await pool.query(`
        SELECT descripcion 
        FROM reclamosestado
        WHERE idReclamoEstado = ?
    `, [idEstado]);

    return estado;
}
};

export default ReclamoDB;
