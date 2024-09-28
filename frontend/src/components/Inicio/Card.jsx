import { Card, Typography } from "@material-tailwind/react";
import institucional from "../../assets/Institucional.jpg";

const CardComponent = () => {
  return (
    <div className="mx-auto max-w-screen-md py-12">
      <Card className="mb-12 overflow-hidden">
        <img
          className="h-[45rem] w-full object-cover object-center"
          src={institucional}
          alt="oficina"
        />
      </Card>
      <Typography variant="h2"  className="mb-2 text-customBlue">
        Institución: Seguimiento de Reclamos y Garantías
      </Typography>
      <Typography color="gray" className="font-normal">
        Nuestra institución se compromete a ofrecer un servicio al cliente
        excepcional, brindando a nuestros usuarios la posibilidad de gestionar
        sus reclamos y verificar el estado de estos de manera sencilla y rápida.
        Tras la compra de un auto o la contratación de un servicio técnico, los
        clientes pueden acceder a nuestra plataforma en línea, donde encontrarán
        un espacio dedicado a sus reclamos. Aquí, podrán visualizar el historial
        de sus solicitudes, revisar el estado actual de cada reclamo y recibir
        actualizaciones en tiempo real. Esto garantiza que cada cliente esté
        siempre informado sobre el proceso de resolución, ofreciendo
        tranquilidad y confianza en el servicio postventa. Nuestro objetivo es
        asegurar que cada experiencia sea satisfactoria y que nuestros clientes
        se sientan respaldados en todo momento.
      </Typography>
    </div>
  );
};

export default CardComponent;
