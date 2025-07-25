import informeService from "../services/informeService.js";

const InformeController = {
  generarInforme: async (req, res) => {
    try {
      const { formato } = req.query;
      
      if (!formato || !['pdf', 'csv'].includes(formato)) {
        return res.status(400).json({ 
          error: "Formato requerido. Use 'pdf' o 'csv'" 
        });
      }

      const resultado = await informeService.generarInforme(formato);
      
      if (formato === 'pdf') {
        res.set(resultado.headers);
        res.send(resultado.buffer);
      } else {
        res.download(resultado.path, 'reporte.csv');
      }
    } catch (error) {
      console.error("Error al generar informe:", error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default InformeController;
