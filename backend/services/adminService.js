import redisClient from "../index.js";
import AdminDB from "../database/adminDB.js";
import bcrypt from "bcrypt";

const AdminService = {
  // Función para obtener usuarios segun idTipoUsuario
  getUsuariosByTipo: async (idTipoUsuario, cacheKey) => {
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Datos de ${cacheKey} obtenidos de la caché`);
        return JSON.parse(cachedData);
      }

      const usuarios = await AdminDB.getAllUsuariosByTipoDB(idTipoUsuario);
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(usuarios)); // Guardar en Redis
      return usuarios;
    } catch (error) {
      console.error(`Error en AdminService.getUsuariosByTipo(${cacheKey}):`, error);
      throw error;
    }
  },

  // Funciones específicas que llaman a la genérica con el idTipoUsuario y cacheKey adecuados
  getAllAdministradores: function () {
    return this.getUsuariosByTipo(1, "administradores")
  },
  getAllEmpleados: function () {
    return this.getUsuariosByTipo(2, "empleados")
  },
  getAllClientes: function () {
    return this.getUsuariosByTipo(3, "clientes")
  },

  crearUsuario: async (usuarioData) => {
    const {
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
    } = usuarioData;
    try {
      // Verificar si el correo electrónico ya existe
      const rows = await AdminDB.verificarCorreo(correoElectronico); // Llamar a la función de verificación

      if (rows.length > 0) {
        return res.status(400).json({ error: "El usuario ya está registrado." }); // Respuesta si el correo ya existe
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      const activo = 1;

      const user = {
        nombre,
        apellido,
        correoElectronico,
        contrasenia: hashedPassword,
        idTipoUsuario,
        imagen,
        activo,
      };

      // Insertar el usuario en la base de datos
      const result = await AdminDB.crearUsuarioDB(user);

      return {
        message: "Usuario creado con éxito",
        id: result.insertId,
        nombre,
        correoElectronico,
        idTipoUsuario,
      };
    } catch (error) {
      console.error("Error en AdminService.crearUsuario:", error);
      throw new Error("Error al crear el usuario.");
    }
  },

  actualizarUsuario: async (idUsuarioModificado,idUsuarioModificador,datosUsuario) => {
    const {
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
      activo,
    } = datosUsuario;

    try {
      // Obtener usuarios de la base de datos
      const [usuarioModificador] = await AdminDB.obtenerUsuarioPorId(
        idUsuarioModificador
      );
      const [usuarioModificado] = await AdminDB.obtenerUsuarioPorId(
        idUsuarioModificado
      );

      if (!usuarioModificado) {
        return { error: "Usuario a modificar no encontrado", status: 404 };
      }
      if (!usuarioModificador) {
        return { error: "Usuario modificador no encontrado", status: 404 };
      }
      if (usuarioModificador.idTipoUsuario != 1) {
        return {
          error: "No tienes permisos para realizar esta operación",
          status: 400,
        };
      }

      // Encriptar contraseña si es necesario
      let nuevaContrasenia = contrasenia;
      if (contrasenia) {
        const salt = await bcrypt.genSalt(10);
        nuevaContrasenia = await bcrypt.hash(contrasenia, salt);
      }

      // Preparar los campos a actualizar
      const camposAActualizar = [];
      const valores = [];

      if (nombre) camposAActualizar.push("nombre = ?"), valores.push(nombre);
      if (apellido)
        camposAActualizar.push("apellido = ?"), valores.push(apellido);
      if (correoElectronico)
        camposAActualizar.push("correoElectronico = ?"),
          valores.push(correoElectronico);
      if (nuevaContrasenia)
        camposAActualizar.push("contrasenia = ?"),
          valores.push(nuevaContrasenia);
      if (idTipoUsuario)
        camposAActualizar.push("idTipoUsuario = ?"),
          valores.push(idTipoUsuario);
      if (imagen) camposAActualizar.push("imagen = ?"), valores.push(imagen);
      if (typeof activo !== "undefined")
        camposAActualizar.push("activo = ?"), valores.push(activo);

      // Si hay campos para actualizar, actualizar en la base de datos
      if (camposAActualizar.length > 0) {
        await AdminDB.actualizarUsuarioDB(
          idUsuarioModificado,
          camposAActualizar,
          valores
        );
      } else {
        return { error: "No hay datos a modificar", status: 400 };
      }

      // Determinar el tipo de usuario
      let tipoUsuario;
      if (usuarioModificado.idTipoUsuario === 3) {
        tipoUsuario = "cliente";
      } else if (usuarioModificado.idTipoUsuario === 2) {
        tipoUsuario = "empleado";
      } else {
        tipoUsuario = "usuario";
      }

      return {
        mensaje: `Se ha modificado un ${tipoUsuario} con éxito.`,
        id: idUsuarioModificado,
        nombre,
        apellido,
        correoElectronico,
        idTipoUsuario,
        imagen,
        activo,
      };
    } catch (error) {
      console.error("Error en AdminService.actualizarUsuario:", error);
      throw new Error("Error al actualizar el usuario.");
    }
  },

  borrarUsuario: async (idUsuario) => {
    try {
      // Obtener el usuario de la base de datos
      const [usuario] = await AdminDB.obtenerUsuarioPorId(idUsuario);

      if (!usuario) {
        return { error: "Usuario a borrar no encontrado", status: 404 };
      }

      // Verificar si el usuario ya está desactivado
      if (usuario.activo === 0) {
        return { error: "El usuario ya estaba desactivado", status: 400 };
      }

      // Desactivar (borrar lógicamente) el usuario
      await AdminDB.borrarUsuarioDB(idUsuario);

      // Determinar el tipo de usuario
      let tipoUsuario;
      if (usuario.idTipoUsuario === 3) {
        tipoUsuario = "cliente";
      } else if (usuario.idTipoUsuario === 2) {
        tipoUsuario = "empleado";
      } else {
        tipoUsuario = "usuario";
      }

      return { mensaje: `Se ha desactivado el ${tipoUsuario} correctamente.` };
    } catch (error) {
      console.error("Error en AdminService.borrarUsuario:", error);
      throw new Error("Error al desactivar el usuario.");
    }
  },
  
};

export default AdminService;
