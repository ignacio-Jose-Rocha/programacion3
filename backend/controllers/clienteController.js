import ClienteService from "../services/clienteService.js";

const ClienteController = {
  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia} = req.body;
    const imagen = req.file ? req.file.filename : null; // Nombre del archivo guardado o null si no se sube
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
    const nuevaImagen = req.file ? req.file.filename : null;
    try {
      // Crear un objeto con los datos de req.body y agregar imagen solo si existe
      const datosActualizados = {
        ...req.body,
        ...(nuevaImagen && { imagen: nuevaImagen })
      };
      // Si hay una nueva imagen, agregarla a los datos a actualizar
      if (nuevaImagen) {
        datosActualizados.imagen = nuevaImagen;
      }
      const updatedCliente = await ClienteService.actualizarCliente(idUsuario, datosActualizados);
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
