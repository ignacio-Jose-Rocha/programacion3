import InformeDB from '../database/informeDB.js';
import InformeHandlebars from './informeHandlebars.js';

const informeService = {
    generarInforme: async function(formato) { 
        if (formato === 'pdf') {
            return await this.reportePdf(); 
        } else if (formato === 'csv') {
            return await this.reporteCsv();
        }
    },
    
    reportePdf: async function() { 
        const datosReporte = await InformeDB.buscarDatosReportePdf();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para el reporte' };
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

    reporteCsv: async function() { 
        const datosReporte = await InformeDB.buscarDatosReporteCsv();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para el reporte' };
        }

        const csv = await InformeHandlebars.informeReclamosCsv(datosReporte);
        return {
            path: csv,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="reporte.csv"'
            }
        };
    }
};

export default informeService;
