import express from 'express';

const router = express.Router();

router.get('/obtener', (req, res) => {
    res.status(200).json({ mensaje: "Endpoint en desarrollo" });
});

export default router;
