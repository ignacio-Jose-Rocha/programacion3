import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TextoInstitucion = () => {
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
    <motion.div
      ref={textRef}
      className="mx-auto max-w-2xl"
      initial={{ x: "-100%", opacity: 0 }} // Posición inicial fuera de la pantalla
      animate={{ x: isVisible ? 0 : "-100%", opacity: isVisible ? 1 : 0 }} // Cuando es visible
      transition={{
        duration: 0.6, // Reduce la duración para hacerla más rápida
        ease: "easeOut", // Cambia a una función de easing más suave
      }}
    >
      <h2 className="text-4xl font-bold text-customBlue text-center">
        Nuestros Últimos Modelos
      </h2>
      <p className="mt-3 text-lg text-center">
        Descubre nuestra selección exclusiva de los modelos más recientes,
        diseñados para ofrecer lo último en innovación, confort y estilo. Nos
        enorgullecemos de brindar vehículos que cumplen con los más altos
        estándares de calidad y tecnología avanzada, adaptados a tus necesidades
        y preferencias.
      </p>
    </motion.div>
  );
};

export default TextoInstitucion;
