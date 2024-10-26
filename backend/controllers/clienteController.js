import ClienteService from "../services/ClienteService.js";

const ClienteController = {
  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;
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
    const { idUsuario} = req.user;
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;
  
    try {
      const updatedCliente = await ClienteService.actualizarCliente(idUsuario, req.body);
      res.json({
        message: "Cliente actualizado con éxito",
        cliente: updatedCliente
      });
    } catch (error) {
      if (error.message.includes("Usuario no encontrado o está inactivo")) {
        res.status(404).json({ error: error.message }); 
      } else if (error.message.includes("No se proporcionaron campos para actualizar")) {
        res.status(400).json({ error: error.message }); 
      } else {
        res.status(500).json({ error: `Ocurrió un error al actualizar el cliente: ${error.message}` }); }
    }
  },
};

export default ClienteController;
