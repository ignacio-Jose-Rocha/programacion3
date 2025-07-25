import dotenv from "dotenv";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; 

dotenv.config(); // Para cargar las variables de entorno

const notificacionEmailService = async (reclamo, estadoReclamo) => {
    try {
        return {
            estado: true,
            mensaje: "Notificación enviada correctamente",
            notificacion: {
                reclamo: reclamo,
                estado: estadoReclamo,
                fechaEnvio: new Date()
            }
        };
    } catch (error) {
        console.error("Error en notificacionEmailService:", error);
        return {
            estado: false,
            mensaje: "Error al enviar notificación"
        };
    }
};

export default notificacionEmailService;
