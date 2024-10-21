import estadisticas from "../database/estadisticasCompletasDB.js";

const EstadisticasService = {
  getEstadisticasCompletas: async () => {
    try {
      const resultados = await estadisticas.getEstadisticasCompletasDB();

      // Asegúrate de que `resultados` tenga la estructura adecuada
      const totalReclamos = resultados[0]; // Total de reclamos
      const reclamosPorEstado = resultados[1]; // Reclamos por estado

      return { totalReclamos, reclamosPorEstado };
    } catch (error) {
      console.error("Error al obtener estadísticas completas", error);
      throw error; // Propaga el error para manejarlo en el controlador
    }
  }
};

export default EstadisticasService;