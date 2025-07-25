import InformeDB from "../database/informeDB.js";
import InformeHandlebars from "./informeHandlebars.js";

const informeService = {
    generarInforme: async function (formato) { 
        if (formato === 'pdf') {
            return await this.reportePdf(); 
        } else if (formato === 'csv') {
            return await this.reporteCsv();
        } else {
            throw new Error("Formato no soportado."); 
        }
    },
    
    reportePdf: async function () { 
        const datosReporte = await InformeDB.buscarDatosReportePdf();

        if (!datosReporte || datosReporte.length === 0) {
            throw new Error('Sin datos para el reporte PDF.');
        }

        const pdf = await InformeHandlebars.informeReclamosPdf(datosReporte);
        
        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        };
    },

    reporteCsv: async function () {
        const datosReporte = await InformeDB.buscarDatosReporteCsv();

        if (!datosReporte || datosReporte.length === 0) {
            throw new Error('Sin datos para el reporte CSV.');
        }

        const rutaArchivo = await InformeHandlebars.informeReclamosCsv(datosReporte);
        
        return {
            path: rutaArchivo
        };
    }
};

export default informeService;
