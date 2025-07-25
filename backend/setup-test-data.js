import pool from './database/config.js';
import bcrypt from 'bcrypt';

const setupTestData = async () => {
    try {
        // Crear usuario admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        await pool.query(`
            INSERT IGNORE INTO usuarios (idUsuario, nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, activo) 
            VALUES (1, 'Admin', 'Sistema', 'admin@sistema.com', ?, 1, 1)
        `, [adminPassword]);

        // Crear usuario empleado
        const empleadoPassword = await bcrypt.hash('empleado123', 10);
        await pool.query(`
            INSERT IGNORE INTO usuarios (idUsuario, nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, activo) 
            VALUES (2, 'Juan', 'Empleado', 'empleado@sistema.com', ?, 2, 1)
        `, [empleadoPassword]);

        console.log('Usuarios de prueba creados');
        console.log('Admin: admin@sistema.com / admin123');
        console.log('Empleado: empleado@sistema.com / empleado123');

        console.log('Datos de prueba creados exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear datos de prueba:', error);
        process.exit(1);
    }
};

setupTestData();