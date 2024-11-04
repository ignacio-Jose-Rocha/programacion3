import pool from "./config.js";

const estadisticas = {
    getEstadisticasCompletasDB: async () => {
      try {
        // Ejecuta el procedimiento almacenado
        const [resultados] = await pool.query("CALL obtenerEstadisticasCompletas()");
        return resultados; // Devuelve los resultados
      } catch (error) {
        console.error("Error al obtener estadísticas completas:", error);
        throw error; // Propaga el error para manejarlo en el controlador o servicio
      }
    },
  
    // Otras funciones de acceso a la base de datos...
  };
  
export default estadisticas;