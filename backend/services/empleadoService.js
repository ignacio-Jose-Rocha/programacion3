import dotenv from "dotenv";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import EmpleadoDB from "../database/empleadoDB.js";

dotenv.config();

const EmpleadoService = {
  listarReclamosOficina: async (idEmpleado) => {
    const reclamos = await EmpleadoDB.obtenerReclamosPorOficinaDB(idEmpleado);

    if (reclamos.length === 0) {
      throw new Error(
        `No se encontraron reclamos para la oficina asignada al empleado con ID ${idEmpleado}`
      );
    }

    return reclamos;
  },

  actualizarEstadoReclamo: async (idCliente, nuevoEstado, idReclamo) => {
    const estadoReclamo = {
      1: "Creado",
      2: "En proceso",
      3: "Cancelado",
      4: "Finalizado",
    };
  
    const estadoNumerico = parseInt(nuevoEstado, 10);
  
    if (!estadoReclamo[estadoNumerico]) {
      throw new Error(
        "El estado proporcionado no es válido. Debe ser un número entre 1 y 4."
      );
    }
  
    // Verificar si el reclamo existe
    const reclamo = await EmpleadoDB.obtenerReclamoPorClienteYReclamoDB(
      idReclamo,
      idCliente
    );
  
    if (!reclamo) {
      throw new Error("No se encontró el reclamo para este usuario.");
    }
  
    // Verificar si el reclamo ya está cancelado o finalizado
    if (reclamo.idReclamoEstado === 3) {
      throw new Error("Reclamo ya cancelado.");
    }
    if (reclamo.idReclamoEstado === 4) {
      throw new Error("Reclamo ya finalizado.");
    }
  
    // Actualizar estado en la base de datos
    const resultado = await EmpleadoDB.actualizarEstadoReclamoDB(
      idReclamo,
      idCliente,
      estadoNumerico
    );
  
    if (resultado.affectedRows === 0) {
      throw new Error("El estado no se pudo actualizar.");
    }
  
    // Cargar plantilla de correo electrónico
    const filename = fileURLToPath(import.meta.url);
    const dir = path.dirname(filename);
    const backendDir = path.resolve(dir, "..");
    const plantilla = fs.readFileSync(
      path.join(backendDir + "/utiles/handlebars/plantilla.hbs"),
      "utf-8"
    );
    const template = handlebars.compile(plantilla);
  
    // Crear datos para la plantilla
    const datos = {
      cliente: reclamo.nombre,
      estadoReclamo: estadoReclamo[estadoNumerico],
      reclamoId: idCliente,
    };
  
    const correoHtml = template(datos);
  
    // Configurar y enviar correo electrónico
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
  
    // Enviar correo
    await transporter.sendMail(mailOptions);
  
    return {
      mensaje: `El estado del reclamo ${idReclamo} ha sido actualizado a ${estadoReclamo[estadoNumerico]}.`,
      notificacion: "Notificación enviada correctamente.",
    };
  },
};

export default EmpleadoService;
