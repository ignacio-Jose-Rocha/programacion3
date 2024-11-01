import PropTypes from "prop-types";
import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline"; // Para Heroicons v2

const Message = ({ message, onClose }) => {
  // Auto-cerrar el mensaje después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(onClose, 1500); // Cerrar automáticamente después de 1 segundos
    return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta antes
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out opacity-100 w-80">
        <div className="flex items-center justify-center space-x-3">
          {/* Icono de verificación */}
          <CheckCircleIcon className="h-8 w-8 text-green-400" aria-hidden="true" />
          
          {/* Texto del mensaje */}
          <p className="text-lg font-semibold">{message}</p>
        </div>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

Message.propTypes = {
  onClose: PropTypes.func.isRequired, // 'onClose' debe ser una función y es requerida
  message: PropTypes.string.isRequired, // 'message' debe ser una cadena y es requerida
};

export default Message;
