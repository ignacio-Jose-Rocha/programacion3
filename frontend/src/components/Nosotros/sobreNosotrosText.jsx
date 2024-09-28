import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function AboutUs() {
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
    <div className="flex justify-center mt-10">
      <motion.div
        ref={textRef}
        className="w-11/12 max-w-2xl text-center"
        initial={{ x: "-100%", opacity: 0 }} // Inicialmente fuera de la pantalla y transparente
        animate={{ x: isVisible ? 0 : "-100%", opacity: isVisible ? 1 : 0 }} // Al entrar en pantalla
        transition={{ duration: 0.9 }} // Duración de la animación
      >
        <h2 className="text-2xl font-bold text-customBlue">Sobre Nosotros</h2>
        <p className="mt-4 text-lg">
          Somos una empresa comprometida con la excelencia, dedicada a brindar
          los mejores servicios y soluciones a nuestros clientes. Nuestra misión
          es superar las expectativas a través de la innovación y la atención al
          detalle.
        </p>
      </motion.div>
    </div>
  );
}

export default AboutUs;
