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
