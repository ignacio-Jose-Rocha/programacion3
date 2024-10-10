
import PropTypes from 'prop-types';

const ClienteDashboard = ({ onLogout }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenido al Dashboard admin</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>
      {/* Aquí puedes añadir el resto del contenido del dashboard */}
    </div>
  );
};

ClienteDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ClienteDashboard;
