import PropTypes from "prop-types"; // Importa PropTypes
import axios from "axios";
import { useState } from "react"; // Importa useState

const RegisterForm = ({ onClose, onRegisterSuccess }) => {
  const [firstName, setFirstName] = useState(""); // Manejamos el estado del nombre
  const [lastName, setLastName] = useState(""); // Manejamos el estado del apellido
  const [email, setEmail] = useState(""); // Manejamos el estado del email
  const [password, setPassword] = useState(""); // Manejamos el estado de la contraseña

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/clientes/register",
        {
          nombre: firstName,
          apellido: lastName,
          correoElectronico: email,
          contrasenia: password,
        }
      );

      const data = response.data;

      if (data.success) {
        onRegisterSuccess(data.token, data.usuario); // Pasa el token y el idTipoUsuario
        alert("Registro exitoso");
      } else {
        alert(data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrarse. Intente nuevamente.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div className="relative w-[500px] rounded-[60px_5px] overflow-hidden shadow-2xl">
        <form
          className="relative z-10 inset-1 bg-gray-900 rounded-[50px_5px] p-10 shadow-xl"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            aria-label="Cerrar"
          >
            ✖️
          </button>

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold text-gray-100">
              Registrarse
            </h1>
          </div>

          <div className="input-box mb-6">
            <label htmlFor="firstName" className="text-gray-300">
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ingrese su nombre"
              required
              className="w-full mt-1 bg-gray-800 rounded-md p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring"
            />
          </div>

          <div className="input-box mb-6">
            <label htmlFor="lastName" className="text-gray-300">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ingrese su apellido"
              required
              className="w-full mt-1 bg-gray-800 rounded-md p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring"
            />
          </div>

          <div className="input-box mb-6">
            <label htmlFor="email" className="text-gray-300">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              required
              className="w-full mt-1 bg-gray-800 rounded-md p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring"
            />
          </div>

          <div className="input-box mb-6">
            <label htmlFor="password" className="text-gray-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              className="w-full mt-1 bg-gray-800 rounded-md p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring"
            />
          </div>

          <div className="input-box mb-8">
            <input
              type="submit"
              value="Registrarse"
              className="w-full bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300"
            />
          </div>

          <p className="text-center text-gray-400">
            ¿Ya tiene una cuenta?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

RegisterForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRegisterSuccess: PropTypes.func.isRequired,
};

export default RegisterForm;
