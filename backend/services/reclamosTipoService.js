import ReclamosTipoDB from '../database/reclamosTipoDB.js';

const ReclamosTipoService = {
    getAllReclamosTipo: async () => {
        try {
            const reclamosTipo = await ReclamosTipoDB.getAllReclamosTipoDB();
            
            if (reclamosTipo.length === 0) {
                return {
                    status: 404,
                    mensaje: "No se encontraron tipos de reclamos"
                };
            }
            
            return {
                status: 200,
                data: reclamosTipo
            };
        } catch (error) {
            throw new Error("Error al obtener tipos de reclamos: " + error.message);
        }
    }
};

export default ReclamosTipoService;
