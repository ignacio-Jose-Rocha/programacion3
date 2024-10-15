import { Routes, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import ClienteDashboard from '../dashboards/dashboard-cliente/DashboardCliente';
import EmpleadoDashboard from '../dashboards/dashboard-empleado/DashboardEmpleado';
import AdminDashboard from '../dashboards/dashboard-admin/DashboardAdmin';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = ({ isAuthenticated, handleLogout }) => {
  return (
    <Routes>
      <Route
        path="/dashboard-cliente"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ClienteDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-empleado"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EmpleadoDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Validaciones de PropTypes
AppRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default AppRoutes;
