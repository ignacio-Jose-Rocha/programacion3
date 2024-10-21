import ClienteService from "../services/ClienteService.js";

const ClienteController = {
  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } =
      req.body;

    try {
      const nuevoCliente = await ClienteService.crearCliente(
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        imagen
      );

      res.status(200).json({
        message: "Cliente creado con éxito",
        ...nuevoCliente,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  actualizarCliente: async (req, res) => {
    const { idCliente } = req.params;
    const { nombre, apellido, correoElectronico, contrasenia, imagen } =
      req.body;
    const tokenD = req.headers.authorization;

    try {
      const updatedCliente = await ClienteService.actualizarCliente(
        idCliente,
        req.body,
        tokenD
      );
      res.json(updatedCliente);
    } catch (error) {
      res
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
