import { Textarea, Button } from "@material-tailwind/react"; // Asegúrate de importar el botón también
import { useEffect, useRef, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion"; // Asegúrate de importar `motion`

const TextareaVariants = () => {
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (textRef.current) {
      const { top, bottom } = textRef.current.getBoundingClientRect();
      // Verifica si el elemento está visible en el viewport
      if (top < window.innerHeight && bottom > 0) {
        setIsVisible(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mx-auto max-w-screen-md py-12">
      <motion.div
        ref={textRef}
        className="w-11/12 max-w-2xl"
        initial={{ x: "-100%", opacity: 0 }} // Inicialmente fuera de la pantalla y transparente
        animate={{ x: isVisible ? 0 : "-100%", opacity: isVisible ? 1 : 0 }} // Al entrar en pantalla
        transition={{ duration: 0.9 }} // Duración de la animación
      >
        <Typography variant="h2" className="mb-2 text-customBlue text-center">
          Realice su consulta
        </Typography>
      </motion.div>
      <div className="flex justify-center items-center w-full mt-10">
        <div className="flex w-96 flex-col gap-6">
          <Textarea
            variant="static"
            label="Ingrese su mail"
            placeholder="Ingrese su correo electrónico"
          />
          <Textarea
            variant="static"
            label="Asunto"
            placeholder="Ingrese el asunto"
          />
          <Textarea variant="outlined" label="Deje su mensaje" />
          
          {/* Botón de Enviar */}
          <div className="flex justify-center">
            <Button
              className="mt-4 w-full bg-customBlue" // Añadir márgenes y hacer que el botón ocupe todo el ancho
              onClick={() => alert("Mensaje enviado")} // Agregar lógica de envío aquí
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextareaVariants;
