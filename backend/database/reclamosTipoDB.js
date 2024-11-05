import pool from "./config.js";

const ReclamosTipoDB = {
  // Función para obtener todos los tipos de reclamos
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

  // Función para obtener tipo de reclamo por ID
  getReclamoTipoByIdDB: async (idReclamoTipo) => {
    try {
      const [[reclamoTipo]] = await pool.query(
        "SELECT * FROM reclamostipo WHERE idReclamoTipo = ?",
        [idReclamoTipo]
      );
      return reclamoTipo;
    } catch (error) {
      console.error("Error al obtener reclamo tipo por ID:", error);
      throw error;
    }
  },

  // Funcion para obtener un tipo de reclamo por descripcion
  getReclamoTipoByDescripcionDB: async (descripcion) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM reclamostipo WHERE descripcion = ?",
        [descripcion]
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener reclamo tipo por descripción:", error);
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
      console.error("Error al desactivar tipo de reclamo:", error);
      throw error;
    }
  },
};

export default ReclamosTipoDB;
