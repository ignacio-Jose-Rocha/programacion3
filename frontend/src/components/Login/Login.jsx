import PropTypes from "prop-types"; // Importa PropTypes

const LoginForm = ({ onClose }) => {
  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita la recarga de la página
    // Aquí puedes manejar la lógica de autenticación, etc.
    // Por ejemplo, si el login es exitoso, puedes cerrar el modal:
    onClose(); // Cierra el modal tras un inicio de sesión exitoso
  };

  return (
    <div 
      className="flex justify-center items-center h-screen bg-darkGray" 
    >
      <div className="relative w-[500px] h-[500px] rounded-[60px_5px] overflow-hidden shadow-2xl">
        <div className="absolute top-[-75%] left-[-75%] w-[650px] h-[700px] bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-600 animate-move-colors" />
        
        <form 
          className="relative z-10 inset-1 bg-gray-900 rounded-[50px_5px] p-10 shadow-xl" 
          onSubmit={handleSubmit} // Llama a la función al enviar el formulario
        >
          <button 
            type="button" // Cambiar a type="button" para evitar enviar el formulario
            onClick={onClose} // Llama a la función onClose al hacer clic
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            aria-label="Cerrar"
          >
            ✖️ {/* Puedes reemplazar esto por un ícono SVG si lo prefieres */}
          </button>
          
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold text-gray-100">Iniciar sesion</h1>
          </div>

          <div className="input-box mb-6">
            <label htmlFor="text" className="text-gray-300">Usuario</label>
            <input
              id="text"
              name="text"
              type="text"
              placeholder="Ingrese su nombre"
              required
              className="w-full mt-1 bg-gray-800 rounded-md p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring"
            />
          </div>

          <div className="input-box mb-6">
            <label htmlFor="password" className="text-gray-300">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingrese su contraseña"
              required
              className="w-full mt-1 bg-gray-800  rounded-md p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring"
            />
          </div>

          <div className="input-box mb-8">
            <input
              type="submit"
              value="Iniciar"
              className="w-full bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300"
            />
          </div>

          <p className="text-center text-gray-400">
            Desea registrarse?{" "}
            <a href="#" className="text-blue-500 hover:underline">Registrarse</a>
          </p>
        </form>
      </div>
    </div>
  );
};
LoginForm.propTypes = {
  onClose: PropTypes.func.isRequired, // Se requiere que onLoginClick sea una función
};


export default LoginForm;
