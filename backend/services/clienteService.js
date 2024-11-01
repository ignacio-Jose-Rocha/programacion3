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
    const camposActualizar = [];
    const valoresActualizar = [];

    // Iterar sobre las propiedades del body
    for (const [key, value] of Object.entries(body)) {
      // Verificar si el valor está definido antes de agregarlo a la lista de actualizaciones
      if (value !== undefined) {
        if (key === 'contrasenia') {
          const hashedPassword = await bcrypt.hash(value, 10);
            camposActualizar.push(`${key}=?`);
            valoresActualizar.push(hashedPassword);
        } else {
          camposActualizar.push(`${key}=?`);
          valoresActualizar.push(value);
        }
      }
    }
    if (camposActualizar.length === 0) {
        throw new Error("No se proporcionaron campos para actualizar");
    }

    // Aquí puedes llamar a la base de datos para realizar la actualización
    await ClienteDB.actualizarUsuarioDB(idCliente, camposActualizar, valoresActualizar);

    // Retorna los datos actualizados
    return {
        id: idCliente,
        nombre: body.nombre || null,
        apellido: body.apellido || null,
        correoElectronico: body.correoElectronico || null,
        imagen: body.imagen || null,
    };
  },
  
};

export default ClienteService;
