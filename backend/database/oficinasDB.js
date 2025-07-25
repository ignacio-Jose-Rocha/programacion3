import pool from "./config.js";

const OficinasDB = {
  getAllOficinasDB: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM oficinas WHERE activo = 1");
      return rows;
    } catch (error) {
      console.error("Error al obtener oficinas:", error);
      throw error;
    }
  },

  getEmpleadosByOficinaDB: async (idOficina) => {
    try {
      const query = `
      SELECT u.nombre, u.apellido, u.idUsuario
      FROM usuarios AS u
      INNER JOIN usuariosOficinas AS uo ON u.idUsuario = uo.idUsuario
      WHERE uo.idOficina = ? AND uo.activo = 1`;
      const [rows] = await pool.query(query, [idOficina]);
      return rows;
    } catch (error) {
      console.error("Error al obtener empleados por oficina:", error);
      throw error;
    }
  },

  buscarEmpleadoDB: async (idUsuario) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE idUsuario = ?",
        [idUsuario]
      );
      return rows[0];
    } catch (error) {
      console.error("Error al buscar empleado en la base de datos:", error);
      throw error;
    }
  },

  asignarEmpleadoDB: async (idOficina, idUsuario) => {
    try {
      const query =
        "INSERT INTO usuariosOficinas (idUsuario, idOficina, activo) VALUES (?, ?, 1)";
      const [result] = await pool.query(query, [idUsuario, idOficina]);
      return result.insertId;
    } catch (error) {
      console.error("Error al asignar el empleado a la oficina", error);
      throw new Error("Error al asignar el empleado a la oficina");
    }
  },

  eliminarEmpleadoDeOficinaDB: async (idUsuario) => {
    try {
      const query =
        "UPDATE usuariosOficinas SET activo = 0 WHERE idUsuario = ?";
      const [result] = await pool.query(query, [idUsuario]);
      return result;
    } catch (error) {
      console.error(
        "Error al desactivar el usuario de la oficina en la base de datos:",
        error
      );
      throw error;
    }
  },
};

export default OficinasDB;
