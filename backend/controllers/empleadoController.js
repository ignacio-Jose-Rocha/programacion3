import dotenv from "dotenv";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { login } from "./authController.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import EmpleadoDB from "../database/empleadoDB.js";

dotenv.config();



const login = async (req, res) => {
  tokenD = await loginFunc(req, res);
};

const EmpleadoController = {
  login: (req, res) => {
    login(req, res);
  },

  listarReclamosOficina: async (req, res) => {
    const { idEmpleado } = req.params;

    try {
      const reclamos = await EmpleadoDB.obtenerReclamosPorOficinaDB(idEmpleado);

      if (reclamos.length === 0) {
        return res.status(400).json({
          error: `No se encontraron reclamos para la oficina asignada al empleado con ID ${idEmpleado}`,
        });
      }

      res.json({ reclamos });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al listar los reclamos de la oficina" });
    }
  },

  ActualizarEstadoReclamo: async (req, res) => {

    const estadoReclamo = {
      1: "Creado",
      2: "En proceso",
      3: "Cancelado",
      4: "Finalizado",
    };

    const { idCliente, nuevoEstado, idReclamo } = req.params;
    const estadoNumerico = parseInt(nuevoEstado, 10);

    if (!estadoReclamo[estadoNumerico]) {
      return res.status(400).json({
        error:
          "El estado proporcionado no es válido. Debe ser un número entre 1 y 4.",
      });
    }

    try {
      const reclamo = await EmpleadoDB.obtenerReclamoPorClienteYReclamoDB(
        idReclamo,
        idCliente
      );

      if (!reclamo) {
        return res
          .status(404)
          .json({ error: "No se encontró el reclamo para este usuario." });
      }

      if (reclamo.idReclamoEstado === 3) {
        return res.status(404).json({ error: "Reclamo ya cancelado." });
      }

      if (reclamo.idReclamoEstado === 4) {
        return res.status(404).json({ error: "Reclamo ya finalizado." });
      }

      const resultado = await EmpleadoDB.actualizarEstadoReclamoDB(
        idReclamo,
        idCliente,
        estadoNumerico
      );

      if (resultado.affectedRows === 0) {
        return res
          .status(400)
          .json({ error: "El estado no se pudo actualizar." });
      }

      // Cargar la plantilla Handlebars
      const filename = fileURLToPath(import.meta.url);
      const dir = path.dirname(filename);
      const backendDir = path.resolve(dir, "..");
      const plantilla = fs.readFileSync(
        path.join(backendDir + "/utiles/handlebars/plantilla.hbs"),
        "utf-8"
      );
      const template = handlebars.compile(plantilla);

      const datos = {
        cliente: reclamo.nombre,
        estadoReclamo: estadoReclamo[estadoNumerico],
        reclamoId: idCliente,
      };

      const correoHtml = template(datos);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.CORREO,
          pass: process.env.CLAVE,
        },
      });

      const mailOptions = {
        to: reclamo.correoElectronico,
        subject: "NOTIFICACION RECLAMO",
        html: correoHtml,
        text: "Este es un mensaje de notificación",
        headers: {
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
          Importance: "Normal",
        },
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error enviando el correo: ", error);
          res.status(500).json({ error: "Error al enviar notificación" });
        } else {
          res.json({
            mensaje: `El estado del reclamo ${idReclamo} ha sido actualizado a ${estadoReclamo[estadoNumerico]}.`,
            notificacion: "Notificación enviada correctamente.",
          });
        }
      });
    } catch (error) {
      console.error("Error al modificar el estado del reclamo:", error);
      res
        .status(500)
        .json({ error: "Error al modificar estado", detalle: error.message });
    }
  },
};

export default EmpleadoController;
