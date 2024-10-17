import ClienteService from "../services/clienteService.js";
import ReclamoService from "../services/ReclamoService.js";

const ClienteController = {
  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } =
      req.body;

    try {
      // Llamar a la capa de servicio para crear el cliente
      const nuevoCliente = await ClienteService.crearCliente(
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        imagen
      );

      // Devolver la respuesta exitosa con los datos del cliente creado
      res.status(200).json({
        message: "Cliente creado con éxito",
        ...nuevoCliente,
      });
    } catch (error) {
      // Manejar errores y devolver la respuesta con el mensaje de error
      res.status(400).json({ error: error.message });
    }
  },

  crearReclamo: async (req, res) => {
    const { asunto, descripcion, idUsuarioCreador, idReclamoTipo } = req.body;

    try {
      // Llamar al servicio para crear el reclamo
      const nuevoReclamo = await ReclamoService.crearReclamo(
        asunto,
        descripcion,
        idUsuarioCreador,
        idReclamoTipo
      );

      // Responder con éxito y los datos del reclamo creado
      res.status(200).json({
        message: "Reclamo creado con éxito",
        ...nuevoReclamo,
      });
    } catch (error) {
      // Manejo de errores
      res.status(400).json({ error: error.message });
    }
  },

  listarTiposReclamos: async (req, res) => {
    try {
      const tiposReclamos = await ReclamoService.obtenerTiposDeReclamos();
      res.json(tiposReclamos);
    } catch (error) {
      console.error("Error al listar tipos de reclamos:", error);
      return res
        .status(500)
        .json({ error: "Error al listar tipos de reclamos" });
    }
  },

  cancelarReclamo: async (req, res) => {
    const { idCliente, idReclamo } = req.params;
    try {
      const result = await ReclamoService.cancelarReclamo(idCliente, idReclamo);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al cancelar reclamo:", error);
      res.status(400).json({ error: error.message });
    }
  },

  obtenerReclamoId: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const reclamos = await ReclamoService.obtenerReclamosPorUsuario(
        idUsuario
      );
      res.status(200).json({ message: "Reclamos encontrados", reclamos });
    } catch (error) {
      console.error("Error al obtener reclamos:", error);
      res
        .status(
          error.message.includes("No se encontraron reclamos") ? 404 : 500
        )
        .json({ error: error.message });
    }
  },

  obtenerReclamoEstado: async (req, res) => {
    const { idCliente } = req.params;
    try {
      const {
        idCliente: clienteId,
        reclamos,
        message,
      } = await ReclamoService.obtenerReclamoEstado(idCliente);
      res.status(200).json({ idCliente: clienteId, reclamos, message });
    } catch (error) {
      console.error("Error al obtener el estado del reclamo:", error);
      return res
        .status(
          error.message.includes("No se encontró") ||
            error.message.includes("no es de tipo cliente")
            ? 404
            : 500
        )
        .json({ error: error.message });
    }
  },

  actualizarCliente: async (req, res) => {
    const { idCliente } = req.params;
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;
    const tokenD = req.headers.authorization; // Asegúrate de extraer el token del encabezado

    try {
      const updatedCliente = await ClienteService.actualizarCliente(
        idCliente,
        req.body,
        tokenD
      );
      res.json(updatedCliente);
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      return res
        .status(
          error.message.includes("No tienes permisos") ||
            error.message.includes("no encontrado")
            ? 403
            : 500
        )
        .json({ error: error.message });
    }
  },
};

export default ClienteController;
