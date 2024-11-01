import pool from "../config.js";

const AdminDB = {
  // Función para obtener usuario segun su tipo de ID:
  getAllUsuariosByTipoDB: async (idTipoUsuario) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE idTipoUsuario = ? AND activo = 1",
        [idTipoUsuario]
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  // Función para crear un usuario
  crearUsuarioDB: async (user) => {
    try {
      const result = await pool.query("INSERT INTO usuarios SET ?", [user]);
      return result;
    } catch (error) {
      console.error("Error al crear usuario en la base de datos:", error);
      throw new Error("Error al crear el usuario en la base de datos.");
    }
  },

  // Función para verificar si el correo electrónico ya existe
  verificarCorreo: async (correoElectronico) => {
    try {
      const [rows] = await pool.query(
        "SELECT correoElectronico FROM usuarios WHERE correoElectronico = ?",
        [correoElectronico]
      );
      return rows;
    } catch (error) {
      console.error("Error en AdminDB.verificarCorreo:", error);
      throw new Error("Error al verificar el correo electrónico.");
    }
  },

  // Función para obtener usuario por ID
  obtenerUsuarioPorId: async (idUsuario) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE idUsuario = ?",
        [idUsuario]
      );
      return rows;
    } catch (error) {
      console.error("Error en AdminDB.obtenerUsuarioPorId:", error);
      throw new Error("Error al obtener el usuario.");
    }
  },

  // Función para actualizar un usuario
  actualizarUsuarioDB: async (idUsuario, camposAActualizar, valores) => {
    try {
      const query = `UPDATE usuarios SET ${camposAActualizar.join(", ")} WHERE idUsuario = ?`;
      await pool.query(query, [...valores, idUsuario]);
    } catch (error) {
      console.error("Error en AdminDB.actualizarUsuarioDB:", error);
      throw new Error("Error al actualizar el usuario en la base de datos.");
    }
  },

  // Función para borrar un usuario
  borrarUsuarioDB: async (idUsuario) => {
    try {
      await pool.query("UPDATE usuarios SET activo = 0 WHERE idUsuario = ?", [
        idUsuario,
      ]);
    } catch (error) {
      console.error("Error al borrar usuario:", error);
      throw error;
    }
  },
};

export default AdminDB;
