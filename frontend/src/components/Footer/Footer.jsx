import { Typography } from "@material-tailwind/react";
import instagram from "../../assets/Footer/instagram.png";
import facebook from "../../assets/Footer/facebook.png";
import whatsapp from "../../assets/Footer/whatsapp.png";

const SITEMAP = [
  {
    title: "Empresa",
    links: ["Sobre Nosotros", "Carreras", "Nuestro Equipo", "Proyectos"],
  },
  {
    title: "Centro de Ayuda",
    links: ["Contáctanos"],
  },
  {
    title: "Recursos",
    links: ["Blog", "Boletín", "Productos Gratis", "Programa de Afiliados"],
  },
  {
    title: "Productos",
    links: ["Plantillas", "UI Kits", "Mockups"],
  },
];

const currentYear = new Date().getFullYear();

export function FooterWithSitemap() {
  return (
    <footer className="relative w-full bg-darkGray">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {SITEMAP.map(({ title, links }, key) => (
            <div key={key} className="w-full">
              <Typography
                variant="small"
                className="mb-4 font-bold uppercase opacity-50 text-white" // Cambia a text-white
              >
                {title}
              </Typography>
              <ul className="space-y-1">
                {links.map((link, key) => (
                  <Typography
                    key={key}
                    as="li"
                    className="font-normal text-white"
                  >
                    {" "}
                    {/* Cambia a text-white */}
                    <a
                      href="#"
                      className="inline-block py-1 pr-2 transition-transform hover:scale-105 text-white hover:text-gray-300" // Cambia a text-white y añade hover:text-gray-300
                    >
                      {link}
                    </a>
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-between border-t border-blue-gray-50 py-4 md:flex-row">
          {/* Texto de derechos reservados */}
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-white md:mb-0" // Cambia a text-white
          >
            &copy; {currentYear}{" "}
            <a href="#" className="text-white hover:text-gray-300">
              GAMAcenter
            </a>
            . Todos los Derechos Reservados.
          </Typography>

          {/* Contenedor de iconos sociales */}
          <div className="flex space-x-3">
            <a href="#" aria-label="Whatssap">
              <img
                src={whatsapp}
                alt="WhatsApp"
                className="w-6 h-6 hover:opacity-80"
              />
            </a>
            <a href="#" aria-label="Instagram">
              <img
                src={instagram}
                alt="Instagram"
                className="w-6 h-6 hover:opacity-80"
              />
            </a>
            <a href="#" aria-label="Facebook">
              <img
                src={facebook}
                alt="Facebook"
                className="w-6 h-6 hover:opacity-80"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterWithSitemap;
