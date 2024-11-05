import oficinaService from "../services/oficinaService.js";

const OficinaController = {
  getAllOficinas: async (req, res) => {
    try {
      const rows = await oficinaService.getAllOficinas();
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener las oficinas:", error);
      res.status(500).json({ error: "Error al obtener las oficinas" });
    }
  },

  getEmpleadosByOficina: async (req, res) => {
    const { idOficina } = req.params;
    try {
      const rows = await oficinaService.getEmpleadosByOficina(idOficina);
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los empleados de la oficina:", error);
      res.status(500).json({ error: error.message });
    }
  },

  asignarEmpleadoAOficina: async (req, res) => {
    const { idOficina, idUsuario } = req.params;
    try {
      const idAsignacion = await oficinaService.asignarEmpleadoAOficina(idOficina, idUsuario);
      res.status(200).json({
        id: idAsignacion,
        message: "Empleado asignado a la oficina correctamente",
      });
    } catch (error) {
      console.error("Error al asignar el empleado a la oficina:", error);
      res.status(500).json({ error: error.message });
    }
  },

  eliminarEmpleadoDeOficina: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const result = await oficinaService.eliminarEmpleadoDeOficina(idUsuario);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado en la oficina" });
      }

      res.json({ message: "Usuario desactivado de la oficina correctamente" });
    } catch (error) {
      console.error("Error al desactivar el usuario de la oficina:", error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default OficinaController;