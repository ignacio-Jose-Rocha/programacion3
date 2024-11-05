import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de inicio
    return <Navigate to="/" />;
  }

  // Si está autenticado, renderizar el contenido protegido
  return children;
};

// Validar que las props sean correctas
ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
