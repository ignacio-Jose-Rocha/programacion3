import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedTitle = () => {
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (textRef.current) {
      const { top, bottom } = textRef.current.getBoundingClientRect();
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
      className="w-11/12 max-w-2xl"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: isVisible ? 0 : "-100%", opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.9 }}
    >
      <Typography variant="h2" className="mb-2 text-customBlue text-center">
        Realice su consulta
      </Typography>
    </motion.div>
  );
};

export default AnimatedTitle;
