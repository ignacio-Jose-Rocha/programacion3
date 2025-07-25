import handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const InformeHandlebars = {
    informeReclamosPdf: async (datos) => {
        try {
            const templatePath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
            const templateHtml = fs.readFileSync(templatePath, 'utf8');
            const template = handlebars.compile(templateHtml);
            const html = template(datos);

            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setContent(html);
            const pdf = await page.pdf({ format: 'A4' });
            await browser.close();

            return pdf;
        } catch (error) {
            throw new Error('Error al generar PDF: ' + error.message);
        }
    },

    informeReclamosCsv: async (datos) => {
        try {
            const csvPath = path.join(__dirname, '../utiles/reclamos.csv');
            const csvWriter = createObjectCsvWriter({
                path: csvPath,
                header: [
                    { id: 'reclamo', title: 'Reclamo' },
                    { id: 'tipo', title: 'Tipo' },
                    { id: 'estado', title: 'Estado' },
                    { id: 'fechaCreado', title: 'Fecha Creado' },
                    { id: 'cliente', title: 'Cliente' }
                ]
            });

            await csvWriter.writeRecords(datos);
            return csvPath;
        } catch (error) {
            throw new Error('Error al generar CSV: ' + error.message);
        }
    }
};

export default InformeHandlebars;