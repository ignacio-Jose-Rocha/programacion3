import pool from '../config.js';
import dotenv from 'dotenv';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { login } from './authController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const EmpleadoController = {
  login: (req, res) => {
    login(req, res);
  },

  listarReclamosOficina: async (req, res) => {
    const { idEmpleado } = req.params;
    try {
      // Consulta optimizada con JOIN para obtener el idOficina, tipo de reclamo y los detalles de los reclamos
      const [reclamos] = await pool.query(`
        SELECT o.nombre, r.asunto, r.descripcion, r.fechaCreado
        FROM usuariosOficinas uo
        JOIN oficinas o ON uo.idOficina = o.idOficina
        JOIN reclamosTipo rt ON o.idReclamoTipo = rt.idReclamoTipo
        JOIN reclamos r ON rt.idReclamoTipo = r.idReclamoTipo
        WHERE uo.idUsuario = ?`, [idEmpleado]);

      // Si no se encontraron reclamos
      if (reclamos.length === 0) {
        return res.status(400).json({ error: `No se encontraron reclamos para la oficina asignada al empleado con ID ${idEmpleado}` });
      }

      // Respuesta JSON con los reclamos encontrados
      res.json({
        reclamos: reclamos,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al listar los reclamos de la oficina' });
    }
  },


  ActualizarEstadoReclamo: async (req, res) => {
    const estadoReclamo = {
      1: "Creado",
      2: "En proceso",
      3: "Cancelado",
      4: "Finalizado"
    };

    const { idCliente, nuevoEstado, idReclamo } = req.params;
    const estadoNumerico = parseInt(nuevoEstado, 10);

    if (!estadoReclamo[estadoNumerico]) {
      return res.status(400).json({ error: "El estado proporcionado no es válido. Debe ser un número entre 1 y 4." });
    }

    try {
      const [[reclamo]] = await pool.query(
        'SELECT r.idReclamo, r.idReclamoEstado, u.correoElectronico, u.nombre FROM reclamos r JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario WHERE r.idReclamo = ? AND r.idUsuarioCreador = ?',
        [idReclamo, idCliente]
      );

      if (!reclamo) {
        return res.status(404).json({ error: "No se encontró el reclamo para este usuario." });
      }

      if (reclamo.idReclamoEstado === 3) {
        return res.status(404).json({ error: "Reclamo ya cancelado." });
      }

      if (reclamo.idReclamoEstado === 4) {
        return res.status(404).json({ error: "Reclamo ya finalizado." });
      }

      let query = 'UPDATE reclamos SET idReclamoEstado = ?';
      const valores = [estadoNumerico];

      if (estadoNumerico === 3) {
        query += ', fechaCancelado = NOW()';
      } else if (estadoNumerico === 4) {
        query += ', fechaFinalizado = NOW()';
      }

      query += ' WHERE idReclamo = ? AND idUsuarioCreador = ?';
      valores.push(idReclamo, idCliente);

      // Ejecutar la actualización
      const [resultado] = await pool.query(query, valores);
      if (resultado.affectedRows === 0) {
        return res.status(400).json({ error: "El estado no se pudo actualizar." });
      }

      // Cargar la plantilla Handlebars
      const filename = fileURLToPath(import.meta.url);
      const dir = path.dirname(filename);
      const backendDir = path.resolve(dir, '..');
      const plantilla = fs.readFileSync(path.join(backendDir + '/utiles/handlebars/plantilla.hbs'), 'utf-8');
      const template = handlebars.compile(plantilla);

      const datos = {
        cliente: reclamo.nombre,
        estadoReclamo: estadoReclamo[estadoNumerico],
        reclamoId: idCliente
      }

      // a mi plantilla le paso la información que quiero mandar
      // handlebars va a reemplazar los ''{{}}'' con la información de 'datos'
      const correoHtml = template(datos);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CORREO,
          pass: process.env.CLAVE
        }
      });

      // opciones de envio 
      const mailOptions = {
        to: reclamo.correoElectronico,
        subject: "NOTIFICACION RECLAMO",
        html: correoHtml,
        text: "Este es un mensaje de notificación",
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'Normal'
        }
      };

      // envio el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error enviado el correo: ", error);
        } else {
          res.json({
            mensaje: `El estado del reclamo ${idReclamo} ha sido actualizado a ${estadoReclamo[estadoNumerico]}.`,
            notificacion: 'Notificación enviada correctamente.'
          });
        }
      });

    }
    catch (error) {
      console.error("Error al modificar el estado del reclamo:", error);
      res.status(500).json({ error: 'Error al modificar estado', detalle: error.message });
    }
  }

}

export default EmpleadoController;