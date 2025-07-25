import ClienteDB from '../database/clienteDB.js';
import bcrypt from 'bcrypt';

const ClienteService = {
    crearCliente: async (nombre, apellido, correoElectronico, contrasenia, imagen) => {
        try {
            const usuarioExistente = await ClienteDB.buscarUsuarioDB(correoElectronico, nombre, apellido);
            
            if (usuarioExistente.length > 0) {
                throw new Error("El usuario ya existe");
            }

            const contraseniaHasheada = await bcrypt.hash(contrasenia, 10);

            const nuevoUsuario = {
                nombre,
                apellido,
                correoElectronico,
                contrasenia: contraseniaHasheada,
                idTipoUsuario: 3,
                imagen,
                activo: 1
            };

            const idUsuario = await ClienteDB.crearUsuarioDB(nuevoUsuario);
            
            return {
                idUsuario,
                nombre,
                apellido,
                correoElectronico
            };
        } catch (error) {
            throw new Error("Error al crear cliente: " + error.message);
        }
    }
};

export default ClienteService;
