import pool from "../config.js";

const AdminDB = {
  // Función para obtener todos los administradores
  getAllAdministradoresDB: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE idTipoUsuario = 1 AND activo = 1"
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      throw error;
    }
  },

  // Función para obtener todos los empleados
  getAllEmpleadosDB: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE idTipoUsuario = 2 AND activo = 1"
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      throw error;
    }
  },

  // Función para obtener todos los clientes
  getAllClientesDB: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE idTipoUsuario = 3 AND activo = 1"
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  },

  // Función para obtener todos los reclamos
  getAllReclamosDB: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM reclamos");
      return rows;
    } catch (error) {
      console.error("Error al obtener reclamos:", error);
      throw error;
    }
  },

  // Función para obtener tipos de reclamos
  getAllReclamosTipoDB: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM reclamostipo WHERE activo = 1"
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener tipos de reclamos:", error);
      throw error;
    }
  },

  // Función para obtener todas las oficinas
  getAllOficinasDB: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM oficinas WHERE activo = 1");
      return rows;
    } catch (error) {
      console.error("Error al obtener oficinas:", error);
      throw error;
    }
  },

  // Función para obtener empleados por oficina
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

  // Función para obtener estadísticas completas
  getEstadisticasCompletasDB: async () => {
    try {
      const [resultados] = await pool.query(
        "CALL obtenerEstadisticasCompletas()"
      );
      return resultados;
    } catch (error) {
      console.error("Error al obtener estadísticas completas:", error);
      throw error;
    }
  },

  // Función para crear tipo de reclamo
  crearReclamoTipoDB: async (descripcion, activo) => {
    try {
      const [rows] = await pool.query("INSERT INTO reclamostipo SET ?", {
        descripcion,
        activo,
      });
      return rows.insertId;
    } catch (error) {
      console.error("Error al crear tipo de reclamo:", error);
      throw error;
    }
  },

  // Función para actualizar tipo de reclamo
  actualizarReclamoTipoDB: async (idReclamoTipo, descripcion) => {
    try {
      await pool.query(
        "UPDATE reclamostipo SET descripcion = ? WHERE idReclamoTipo = ?",
        [descripcion, idReclamoTipo]
      );
    } catch (error) {
      console.error("Error al actualizar tipo de reclamo:", error);
      throw error;
    }
  },

  // Función para borrar tipo de reclamo
  borrarReclamoTipoDB: async (idReclamoTipo) => {
    try {
      await pool.query(
        "UPDATE reclamostipo SET activo = 0 WHERE idReclamoTipo = ?",
        [idReclamoTipo]
      );
    } catch (error) {
      console.error("Error al borrar tipo de reclamo:", error);
      throw error;
    }
  },

  // Función para crear un usuario
  crearUsuarioDB: async (usuario) => {
    const {
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
      activo,
    } = usuario;
    try {
      const [rows] = await pool.query("INSERT INTO usuarios SET ?", {
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen,
        activo,
      });
      return rows.insertId;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  // Función para actualizar un usuario
  actualizarUsuarioDB: async (idUsuario, camposAActualizar, valores) => {
    try {
      const query = `UPDATE usuarios SET ${camposAActualizar.join(
        ", "
      )} WHERE idUsuario = ?`;
      await pool.query(query, [...valores, idUsuario]);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
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

  // Función para asignar empleado a oficina
  asignarEmpleadoDB: async (idUsuario, idOficina) => {
    try {
      const query =
        "INSERT INTO usuariosOficinas (idUsuario, idOficina, activo) VALUES (?, ?, 1)";
      const result = await pool.query(query, [idUsuario, idOficina]);
      return result.insertId; // Devuelve el id de la asignación realizada
    } catch (error) {
      console.error("Error al asignar el empleado a la oficina", error);
      throw new Error("Error al asignar el empleado a la oficina");
    }
  },

  // Función para eliminar empleado de oficina
  eliminarEmpleadoDeOficinaDB: async (idUsuario) => {
    try {
      const query = 'UPDATE usuariosOficinas SET activo = 0 WHERE idUsuario = ?';
      const result = await pool.query(query, [idUsuario]);
      return result; // Se devuelve el resultado de la consulta
    } catch (error) {
      console.error('Error al desactivar el usuario de la oficina en la base de datos:', error);
      throw error;
    }
  },
};

export default AdminDB;
