import { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
  Switch,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

const ClienteDashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <Card
          className={`relative transition-transform duration-300 ease-in-out h-[calc(100vh-2rem)] p-4 shadow-xl shadow-blue-gray-900/5 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 max-w-[20rem] ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
        >
          <div className="mb-2 p-4">
            <Typography variant="h5" color={darkMode ? "white" : "black"}>
              Panel de Control
            </Typography>
          </div>
          <List className={darkMode ? "text-gray-300" : "text-gray-700"}>
            <ListItem>
              <ListItemPrefix>
                <PresentationChartBarIcon
                  className={`h-5 w-5 ${darkMode ? "text-white" : "text-black"}`}
                />
              </ListItemPrefix>
              Tablero
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <UserCircleIcon
                  className={`h-5 w-5 ${darkMode ? "text-white" : "text-black"}`}
                />
              </ListItemPrefix>
              Perfil
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <Cog6ToothIcon
                  className={`h-5 w-5 ${darkMode ? "text-white" : "text-black"}`}
                />
              </ListItemPrefix>
              Configuración
            </ListItem>
            <ListItem onClick={onLogout}>
              <ListItemPrefix>
                <PowerIcon
                  className={`h-5 w-5 ${darkMode ? "text-white" : "text-black"}`}
                />
              </ListItemPrefix>
              Cerrar Sesión
            </ListItem>
          </List>

          {/* Switch para alternar el modo oscuro */}
          <div className="mt-4 flex justify-between items-center px-4">
            <Typography variant="small" color={darkMode ? "white" : "black"}>
              Modo Oscuro
            </Typography>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </div>
        </Card>

        {/* Botón para cerrar el sidebar, centrado verticalmente y ajustado a la izquierda del sidebar */}
        <div
          className={`absolute bottom-1/2 transform -translate-y-1/2 transition-all duration-300`}
          style={{ marginLeft: sidebarOpen ? "235px" : "5px" }}
        >
          <IconButton
            onClick={toggleSidebar}
            className={`transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-300 text-black hover:bg-gray-400"
            } p-2 rounded-full`}
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </IconButton>
        </div>

        {/* Contenido principal */}
        <div
          className={`flex-grow p-6 transition-all duration-300 ${
            sidebarOpen ? "" : "w-full left-0 absolute"
          }`}
          style={{ left: sidebarOpen ? "0" : "0" }}
        >
          <Typography variant="h4" color={darkMode ? "white" : "black"}>
            Bienvenido al Panel de Control
          </Typography>
          {/* Aquí va el contenido principal */}
        </div>
      </div>
    </div>
  );
};

ClienteDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ClienteDashboard;
