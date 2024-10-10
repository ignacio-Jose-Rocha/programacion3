import pool from '../config.js';

const EmpleadoDB = {
  // Función para obtener los reclamos de la oficina del empleado
  obtenerReclamosPorOficinaDB: async (idEmpleado) => {
    try {
      const [reclamos] = await pool.query(`
        SELECT o.nombre, r.asunto, r.descripcion, r.fechaCreado
        FROM usuariosOficinas uo
        JOIN oficinas o ON uo.idOficina = o.idOficina
        JOIN reclamosTipo rt ON o.idReclamoTipo = rt.idReclamoTipo
        JOIN reclamos r ON rt.idReclamoTipo = r.idReclamoTipo
        WHERE uo.idUsuario = ?`, [idEmpleado]);
      return reclamos;
    } catch (error) {
      throw new Error('Error al obtener los reclamos de la oficina: ' + error.message);
    }
  },

  // Función para obtener un reclamo por idCliente y idReclamo
  obtenerReclamoPorClienteYReclamoDB: async (idReclamo, idCliente) => {
    try {
      const [[reclamo]] = await pool.query(`
        SELECT r.idReclamo, r.idReclamoEstado, u.correoElectronico, u.nombre
        FROM reclamos r
        JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
        WHERE r.idReclamo = ? AND r.idUsuarioCreador = ?`, [idReclamo, idCliente]);
      return reclamo;
    } catch (error) {
      throw new Error('Error al obtener el reclamo: ' + error.message);
    }
  },

  // Función para actualizar el estado del reclamo
  actualizarEstadoReclamoDB: async (idReclamo, idCliente, estadoNumerico) => {
    try {
      let query = 'UPDATE reclamos SET idReclamoEstado = ?';
      const valores = [estadoNumerico];

      if (estadoNumerico === 3) {
        query += ', fechaCancelado = NOW()';
      } else if (estadoNumerico === 4) {
        query += ', fechaFinalizado = NOW()';
      }

      query += ' WHERE idReclamo = ? AND idUsuarioCreador = ?';
      valores.push(idReclamo, idCliente);

      const [resultado] = await pool.query(query, valores);
      return resultado;
    } catch (error) {
      throw new Error('Error al actualizar el estado del reclamo: ' + error.message);
    }
  },
};

export default EmpleadoDB;
