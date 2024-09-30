import React from "react";
import galery1 from "../../assets/galery1.jpg";
import galery2 from "../../assets/galery2.jpg";
import galery3 from "../../assets/galery3.jpg";
import galery4 from "../../assets/galery4.jpg";
import galery5 from "../../assets/galery5.jpg";

export function FeaturedImageGallery() {
  const data = [
    {
      imgelink: galery1,
    },
    {
      imgelink: galery2,
    },
    {
      imgelink: galery3,
    },
    {
      imgelink: galery4,
    },
    {
      imgelink: galery5,
    },
  ];

  const [active, setActive] = React.useState(data[0].imgelink); // Usa la primera imagen del arreglo

  return (
    <div className="mx-auto max-w-3xl"> {/* Centra y limita el ancho */}
      <div>
        <img
          className="h-auto w-full max-w-full rounded-lg object-cover object-center" // Asegúrate de que mantenga la calidad
          src={active}
          alt=""
        />
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2"> {/* Reduce el espacio entre imágenes */}
        {data.map(({ imgelink }, index) => (
          <div key={index}>
            <img
              onClick={() => setActive(imgelink)}
              src={imgelink}
              className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
              alt={`gallery-image-${index}`} // Mejora la accesibilidad
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedImageGallery;
