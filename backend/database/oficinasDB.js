import pool from './config.js';

const OficinaDB = {
    getAllOficinasDB: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT o.idOficina, o.nombre, rt.descripcion as tipoReclamo,
                       COUNT(uo.idUsuario) as cantidadEmpleados
                FROM oficinas o
                LEFT JOIN reclamosTipo rt ON o.idReclamoTipo = rt.idReclamoTipo
                LEFT JOIN usuariosOficinas uo ON o.idOficina = uo.idOficina
                GROUP BY o.idOficina, o.nombre, rt.descripcion
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener oficinas: ' + error.message);
        }
    },

    buscarOficinaPorNombreDB: async (nombre) => {
        try {
            const [rows] = await pool.query('SELECT * FROM oficinas WHERE nombre = ?', [nombre]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar oficina por nombre: ' + error.message);
        }
    },

    crearOficinaDB: async (datosOficina) => {
        try {
            const { nombre, idReclamoTipo } = datosOficina;
            const [result] = await pool.query(
                'INSERT INTO oficinas (nombre, idReclamoTipo) VALUES (?, ?)',
                [nombre, idReclamoTipo]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear oficina: ' + error.message);
        }
    },

    actualizarOficinaDB: async (idOficina, datosActualizacion) => {
        try {
            const campos = Object.keys(datosActualizacion);
            const valores = Object.values(datosActualizacion);
            
            if (campos.length === 0) {
                throw new Error('No hay datos para actualizar');
            }

            const setClauses = campos.map(campo => `${campo} = ?`).join(', ');
            valores.push(idOficina);

            await pool.query(`UPDATE oficinas SET ${setClauses} WHERE idOficina = ?`, valores);
            return { idOficina, ...datosActualizacion };
        } catch (error) {
            throw new Error('Error al actualizar oficina: ' + error.message);
        }
    },

    eliminarOficinaDB: async (idOficina) => {
        try {
            await pool.query('DELETE FROM oficinas WHERE idOficina = ?', [idOficina]);
        } catch (error) {
            throw new Error('Error al eliminar oficina: ' + error.message);
        }
    }
};

export default OficinaDB;