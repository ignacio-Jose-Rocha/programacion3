import bcrypt from 'bcrypt';
import ClienteDB from '../database/clienteDB.js'; 

const ClienteService = {
  // Crear un nuevo cliente
  crearCliente: async (nombre, apellido, correoElectronico, contrasenia, imagen) => {
    
    // Verificar si el usuario ya existe
    const usuarios = await ClienteDB.buscarUsuarioDB(correoElectronico, nombre, apellido);
    if (usuarios.length > 0) {
      throw new Error('Los datos ya están cargados.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const idTipoUsuario = 3;  // por defecrto va a ser tipo 3 "cliente" y activo = 1
    const activo = 1; 

    // Crear el usuario en la base de datos
    const idUsuario = await ClienteDB.crearUsuarioDB({
      nombre,
      apellido,
      correoElectronico,
      contrasenia: hashedPassword,
      idTipoUsuario,
      imagen,
      activo,
    });

    return {
      idUsuario,
      nombre,
      apellido,
      correoElectronico,
      imagen,
      activo,
      idTipoUsuario,
    };
  },

  actualizarCliente: async (idCliente, body) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = body;
    const user = await ClienteDB.buscarUsuarioActivoPorIdDB(idCliente);
    
    if (!user) {
      throw new Error("Usuario no encontrado o está inactivo");
    }
  
    const camposActualizar = [];
    const valoresActualizar = [];
  
    if (nombre) {
      camposActualizar.push("nombre=?");
      valoresActualizar.push(nombre);
    }
    if (apellido) {
      camposActualizar.push("apellido=?");
      valoresActualizar.push(apellido);
    }
    if (correoElectronico) {
      camposActualizar.push("correoElectronico=?");
      valoresActualizar.push(correoElectronico);
    }
    if (contrasenia) {
      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      camposActualizar.push("contrasenia=?");
      valoresActualizar.push(hashedPassword);
    }
    if (imagen) {
      camposActualizar.push("imagen=?");
      valoresActualizar.push(imagen);
    }
  
    if (camposActualizar.length === 0) {
      throw new Error("No se proporcionaron campos para actualizar");
    }
   
    await ClienteDB.actualizarUsuarioDB(idCliente, camposActualizar, valoresActualizar);

    return {
      id: idCliente,
      nombre,
      apellido,
      correoElectronico,
      imagen,
    };
  },
  
};

export default ClienteService;
