import pool from "../config.js";

const ClienteDB = {
  // Función para buscar usuario por correo electrónico, nombre y apellido
  buscarUsuarioDB: async (correoElectronico, nombre, apellido) => {
    try {
      const [usuarios] = await pool.query(
        "SELECT * FROM usuarios WHERE correoElectronico=? AND nombre=? AND apellido=?",
        [correoElectronico, nombre, apellido]
      );
      return usuarios;
    } catch (error) {
      throw new Error("Error al buscar el usuario: " + error.message);
    }
  },

  // Función para crear un nuevo usuario y devolver el ID del nuevo usuario
  crearUsuarioDB: async (usuarioData) => {
    try {
      const [result] = await pool.query(
        "INSERT INTO usuarios SET ?",
        usuarioData
      );
      return result.insertId;
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  },

  // Verifica si existe un reclamo para un usuario específico con el mismo asunto
  // Además, obtiene el tipo de usuario (cliente, empleado, administrador)
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

  // Obtiene todos los tipos de reclamos que están activos
  obtenerTiposDeReclamosDB: async () => {
    try {
      const [tiposReclamos] = await pool.query(
        "SELECT idReclamoTipo, descripcion FROM reclamostipo WHERE activo = 1"
      );
      return tiposReclamos;
    } catch (error) {
      throw new Error(
        "Error al obtener los tipos de reclamos: " + error.message
      );
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

  // Actualiza los datos de un usuario utilizando una consulta SQL personalizada
  actualizarUsuarioDB: async (idUsuario, camposActualizar, valores) => {
    try {
      const query = `UPDATE usuarios SET ${camposActualizar.join(
        ", "
      )} WHERE idCliente=? AND idTipoUsuario = 3`;
      await pool.query(query, [...valores, idUsuario]);
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  },

  // Busca un usuario activo en la base de datos por su ID
  buscarUsuarioActivoPorIdDB: async (idUsuario) => {
    try {
      const [[user]] = await pool.query(
        "SELECT * FROM usuarios WHERE idUsuario = ? AND activo = 1",
        [idUsuario]
      );
      return user;
    } catch (error) {
      throw new Error("Error al buscar el usuario activo: " + error.message);
    }
  },
};

export default ClienteDB;
