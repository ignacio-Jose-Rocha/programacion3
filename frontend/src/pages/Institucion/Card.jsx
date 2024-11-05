import { Card } from "@material-tailwind/react";
import institucional from "../../assets/Institucion/Institucional.jpg";
import TextoInstitucion from "./institucionText"; // Importa el nuevo componente

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
      <TextoInstitucion /> {/* Usa el componente separado */}
    </div>
  );
};

export default CardComponent;