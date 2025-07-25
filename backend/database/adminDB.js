import pool from './config.js';

const AdminDB = {
    getAllUsuariosByTipoDB: async (idTipoUsuario) => {
        try {
            const [rows] = await pool.query(`
                SELECT u.idUsuario, u.nombre, u.apellido, u.correoElectronico, 
                       u.activo, o.nombre as oficina
                FROM usuarios u
                LEFT JOIN usuariosOficinas uo ON u.idUsuario = uo.idUsuario
                LEFT JOIN oficinas o ON uo.idOficina = o.idOficina
                WHERE u.idTipoUsuario = ?
                ORDER BY u.idUsuario DESC
            `, [idTipoUsuario]);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    },

    buscarUsuarioPorEmailDB: async (correoElectronico) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM usuarios WHERE correoElectronico = ?',
                [correoElectronico]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar usuario por email: ' + error.message);
        }
    },

    crearUsuarioDB: async (datosUsuario) => {
        try {
            const { nombre, apellido, correoElectronico, password, idTipoUsuario } = datosUsuario;
            const [result] = await pool.query(`
                INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, fechaCreado, activo)
                VALUES (?, ?, ?, ?, ?, NOW(), 1)
            `, [nombre, apellido, correoElectronico, password, idTipoUsuario]);
            
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear usuario: ' + error.message);
        }
    },

    asignarUsuarioOficinaDB: async (idUsuario, idOficina) => {
        try {
            await pool.query(`
                INSERT INTO usuariosOficinas (idUsuario, idOficina, fechaAsignacion, activo)
                VALUES (?, ?, NOW(), 1)
            `, [idUsuario, idOficina]);
        } catch (error) {
            throw new Error('Error al asignar usuario a oficina: ' + error.message);
        }
    },

    actualizarUsuarioDB: async (idUsuario, datosActualizacion) => {
        try {
            const campos = Object.keys(datosActualizacion);
            const valores = Object.values(datosActualizacion);
            
            if (campos.length === 0) {
                throw new Error('No hay datos para actualizar');
            }

            const setClauses = campos.map(campo => `${campo} = ?`).join(', ');
            valores.push(idUsuario);

            await pool.query(`
                UPDATE usuarios SET ${setClauses} WHERE idUsuario = ?
            `, valores);

            return { idUsuario, ...datosActualizacion };
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    },

    eliminarUsuarioDB: async (idUsuario) => {
        try {
            await pool.query('UPDATE usuarios SET activo = 0 WHERE idUsuario = ?', [idUsuario]);
        } catch (error) {
            throw new Error('Error al eliminar usuario: ' + error.message);
        }
    }
};

export default AdminDB;
