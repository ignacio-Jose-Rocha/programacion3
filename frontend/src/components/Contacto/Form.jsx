import { Textarea, Button } from "@material-tailwind/react";
import TextoContacto from "./contactoText"; // Importamos el nuevo componente

const TextareaVariants = () => {
  return (
    <div className="mx-auto max-w-screen-md py-12">
      {/* Renderizamos el título animado */}
      <TextoContacto />
      {/* Formulario de contacto */}
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
              className="mt-4 w-full bg-customBlue"
              onClick={() => alert("Mensaje enviado")}
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
