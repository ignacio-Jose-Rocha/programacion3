import { Carousel, Typography, Button } from "@material-tailwind/react";
import carousel1 from "../../assets/modalcar1.jpg"
import carousel2 from "../../assets/modalcar2.jpg"
import carousel3 from "../../assets/modalcar3.jpg"
export function CarouselWithContent() {
  return (
    <Carousel className="relative w-full z-0 ">
      <div className="relative h-[780px] w-full">
        <img
          src={carousel1} alt="Carousel Image 1"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              ¡Bienvenido a Tu Nueva Experiencia Automotriz!
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Explora una amplia gama de vehículos, desde los últimos modelos hasta opciones económicas, y descubre un servicio 
              personalizado pensado para brindarte la mejor experiencia de compra.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button size="lg" color="white">
                Explore
              </Button>
              <Button size="lg" color="white" variant="text">
                Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-[780px] w-full ">
        <img
          src={carousel2} alt="Carousel Image 2"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-center bg-black/75">
          <div className="w-3/4 pl-12 md:w-2/4 md:pl-20 lg:pl-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Gestiona Tus Reclamos con Facilidad
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
             Nuestro sistema eficiente te permite resolver cualquier inconveniente de forma rápida y sencilla, 
             asegurando que cada reclamo sea atendido con la máxima prioridad y transparencia.
            </Typography>
            <div className="flex gap-2">
              <Button size="lg" color="white">
                Explore
              </Button>
              <Button size="lg" color="white" variant="text">
                Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-[780px] w-full">
        <img
          src={carousel3} alt="Carousel Image 2"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-end bg-black/75">
          <div className="w-3/4 pl-12 pb-12 md:w-2/4 md:pl-20 md:pb-20 lg:pl-32 lg:pb-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Encuentra el Auto de Tus Sueños
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Explora las mejores opciones del mercado, cuidadosamente seleccionadas para ofrecerte el vehículo perfecto, 
              ajustado a tus necesidades y preferencias.
            </Typography>
            <div className="flex gap-2">
              <Button size="lg" color="white">
                Explore
              </Button>
              <Button size="lg" color="white" variant="text">
                Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
}

export default CarouselWithContent;
