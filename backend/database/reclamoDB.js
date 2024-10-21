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


  // Busca un reclamo específico para un cliente utilizando su ID y el ID del reclamo
  buscarReclamoPorIdDB: async (idCliente, idReclamo) => {
    try {
      const [[reclamo]] = await pool.query(
        "SELECT * FROM reclamos WHERE idUsuarioCreador=? AND idReclamo=?",
        [idCliente, idReclamo]
      );
      return reclamo;
    } catch (error) {
      throw new Error("Error al buscar el reclamo por ID: " + error.message);
    }
  },

  // Cancela un reclamo asignando un nuevo estado (cancelado) al reclamo
  cancelarReclamoDB: async (idCliente, idReclamo) => {
    try {
      await pool.query(
        "UPDATE reclamos SET idReclamoEstado=3 WHERE idUsuarioCreador = ? AND idReclamo=?",
        [idCliente, idReclamo]
      );
    } catch (error) {
      throw new Error("Error al cancelar el reclamo: " + error.message);
    }
  },

  // Obtiene todos los reclamos hechos por un usuario específico
  obtenerReclamosPorUsuarioDB: async (idUsuario) => {
    try {
      const [rows] = await pool.query(
        "SELECT idReclamo, asunto, idReclamoEstado FROM reclamos where idUsuarioCreador=?",
        [idUsuario]
      );
      return rows;
    } catch (error) {
      throw new Error(
        "Error al obtener los reclamos del usuario: " + error.message
      );
    }
  },

  // Obtiene los detalles de un usuario específico por su ID
  obtenerUsuarioPorIdDB: async (idCliente) => {
    try {
      const [[usuario]] = await pool.query(
        "SELECT idUsuario, idTipoUsuario FROM usuarios WHERE idUsuario = ?",
        [idCliente]
      );
      return usuario;
    } catch (error) {
      throw new Error("Error al obtener el usuario por ID: " + error.message);
    }
  },
};

export default ReclamoDB;
