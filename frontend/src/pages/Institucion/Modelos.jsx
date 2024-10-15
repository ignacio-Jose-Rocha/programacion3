import React, { useEffect, useMemo } from "react";
import galery1 from "../../assets/Galeria/galery1.jpg";
import galery2 from "../../assets/Galeria/galery2.jpg";
import galery3 from "../../assets/Galeria/galery3.jpg";
import galery4 from "../../assets/Galeria/galery4.jpg";
import galery5 from "../../assets/Galeria/galery5.jpg";
import TextoModelos from "./modelosText"; // Importa el nuevo componente

// Función para precargar las imágenes
const preloadImages = (images) => {
  images.forEach((imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
  });
};

export function FeaturedImageGallery() {
  const data = useMemo(
    () => [
      { imgelink: galery1 },
      { imgelink: galery2 },
      { imgelink: galery3 },
      { imgelink: galery4 },
      { imgelink: galery5 },
    ],
    []
  );

  const [active, setActive] = React.useState(data[0].imgelink);

  // Precargar todas las imágenes al montar el componente
  useEffect(() => {
    const imageLinks = data.map(({ imgelink }) => imgelink);
    preloadImages(imageLinks);
  }, [data]);

  return (
    <div id="modelos-section">
      <div className="mx-auto max-w-screen-md py-8">
        <TextoModelos />
      </div>
      <div className="mx-auto max-w-5xl">
        {/* Imagen principal */}
        <div>
          <img
            className="h-auto w-full max-w-full rounded-lg object-cover object-center"
            src={active}
            alt="Active gallery image"
          />
        </div>

        {/* Miniaturas de imágenes */}
        <div className="grid grid-cols-5 gap-2 justify-items-center mt-5">
          {data.map(({ imgelink }, index) => (
            <div key={index}>
              <img
                onClick={() => setActive(imgelink)}
                src={imgelink}
                className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
                alt={`gallery-thumbnail-${index}`}
                loading="lazy" // Carga diferida para mejorar la eficiencia
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(FeaturedImageGallery);
