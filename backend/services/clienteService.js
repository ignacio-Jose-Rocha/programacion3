import bcrypt from 'bcrypt';
import ClienteDB from '../database/clienteDB.js'; // Importar la base de datos

const ClienteService = {
  // Crear un nuevo cliente
  crearCliente: async (nombre, apellido, correoElectronico, contrasenia, imagen) => {
    if (!nombre || !apellido || !correoElectronico || !contrasenia) {
      const errores = [];
      if (!nombre) errores.push("nombre");
      if (!apellido) errores.push("apellido");
      if (!correoElectronico) errores.push("correoElectronico");
      if (!contrasenia) errores.push("contrasenia");

      throw new Error(`Faltan los siguientes datos requeridos: ${errores.join(', ')}`);
    }

    const idTipoUsuario = 3;
    const activo = 1;

    // Verificar si el usuario ya existe
    const usuarios = await ClienteDB.buscarUsuarioDB(correoElectronico, nombre, apellido);
    if (usuarios.length > 0) {
      throw new Error('Los datos ya están cargados.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

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

  actualizarCliente: async (idCliente, body, tokenD) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = body;
  
    // Verificar el token
    const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
    
    if (decodedToken.idTipoUsuario != 3) {
      throw new Error("No tienes permisos para realizar esta operación");
    }
    
    // Verifica si el usuario existe y es activo
    const [[user]] = await ClienteDB.buscarUsuarioActivoPorIdDB(idCliente);
    
    if (!user) {
      throw new Error("Usuario no encontrado o está inactivo");
    }
    
    if (user.idTipoUsuario != 3) {
      throw new Error("No tienes permisos para realizar esta operación");
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
