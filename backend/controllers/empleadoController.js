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

  getAllEmpleados: async (req, res) => {
    try {
      console.log('hola')
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 2 and activo = 1');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  listarReclamosOficina: async (req, res) => {
    const { idEmpleado } = req.params;
    console.log(idEmpleado);

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

      console.log(reclamos);

      // Respuesta JSON con los reclamos encontrados
      res.json({
        reclamos: reclamos,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al listar los reclamos de la oficina' });
    }
  },


  //Agregar validacion de que no modifique varios reclamos de un mismo usuario, pasar tambien idReclamo a modificar
  //Y Avisar que numero de reclamo es el que cambio
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
    console.log(estadoReclamo[estadoNumerico]);

    try {
      const [[reclamo]] = await pool.query(
        'SELECT r.idReclamo, u.correoElectronico, u.nombre FROM reclamos r JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario WHERE r.idReclamo = ? AND r.idUsuarioCreador = ?',
        [idReclamo, idCliente]
      );

      if (!reclamo) {
        return res.status(404).json({ error: "No se encontró el reclamo para este usuario." });
      }

      const [resultado] = await pool.query('UPDATE reclamos SET idReclamoEstado = ? WHERE idReclamo = ? AND idUsuarioCreador = ?',
        [estadoNumerico, idReclamo, idCliente]
      );

      if (resultado.affectedRows === 0) {
        return res.status(400).json({ error: "El estado no se pudo actualizar." });
      }

      // Cargar la plantilla Handlebars
      const filename = fileURLToPath(import.meta.url);
      const dir = path.dirname(filename);
      const backendDir = path.resolve(dir, '..');
      const plantilla = fs.readFileSync(path.join(backendDir + '/utiles/handlebars/plantilla.hbs'), 'utf-8');
      const template = handlebars.compile(plantilla);

      console.log(template);

      const datos = {
        cliente: reclamo.nombre, 
        estadoReclamo: estadoReclamo[estadoNumerico]
      }

      // a mi plantilla le paso la información que quiero mandar
      // handlebars va a reemplazar los ''{{}}'' con la información de 'datos'
      const correoHtml = template(datos);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CORREO, // no olvidar definir en el .env
          pass: process.env.CLAVE
        }
      });

      // opciones de envio 
      const mailOptions = {
        to: reclamo.correoElectronico,
        subject: "NOTIFICACION RECLAMO",
        html: correoHtml,
        text: "Este es un mensaje de notificación",  // Añade esto
        headers: {
          'X-Priority': '3', // Normal priority
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