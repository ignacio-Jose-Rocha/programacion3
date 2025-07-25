import AdminService from "../services/adminService.js";

const AdminController = {
    getAllEmpleados: async (req, res) => {
        try {
            const empleados = await AdminService.getAllEmpleados();
            res.status(200).json({
                estado: "OK",
                data: empleados
            });
        } catch (error) {
            console.error("Error al obtener empleados:", error);
            res.status(500).json({ error: "Error al obtener empleados" });
        }
    },

    getAllClientes: async (req, res) => {
        try {
            const clientes = await AdminService.getAllClientes();
            res.status(200).json({
                estado: "OK",
                data: clientes
            });
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            res.status(500).json({ error: "Error al obtener clientes" });
        }
    },

    crearEmpleado: async (req, res) => {
        try {
            const { nombre, apellido, correoElectronico, password, idOficina } = req.body;
            
            if (!nombre || !apellido || !correoElectronico || !password || !idOficina) {
                return res.status(400).json({ 
                    error: "Todos los campos son requeridos" 
                });
            }

            const nuevoEmpleado = await AdminService.crearEmpleado({
                nombre,
                apellido,
                correoElectronico,
                password,
                idOficina
            });
            
            res.status(201).json({
                estado: "OK",
                mensaje: "Empleado creado exitosamente",
                data: nuevoEmpleado
            });
        } catch (error) {
            console.error("Error al crear empleado:", error);
            res.status(400).json({ error: error.message });
        }
    },

    actualizarEmpleado: async (req, res) => {
        try {
            const { id } = req.params;
            const datosActualizacion = req.body;
            
            const empleadoActualizado = await AdminService.actualizarEmpleado(id, datosActualizacion);
            res.status(200).json({
                estado: "OK",
                mensaje: "Empleado actualizado exitosamente",
                data: empleadoActualizado
            });
        } catch (error) {
            console.error("Error al actualizar empleado:", error);
            res.status(400).json({ error: error.message });
        }
    },

    eliminarEmpleado: async (req, res) => {
        try {
            const { id } = req.params;
            await AdminService.eliminarEmpleado(id);
            res.status(200).json({ 
                estado: "OK",
                mensaje: "Empleado eliminado exitosamente" 
            });
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

export default AdminController;
