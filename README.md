# programacion3

# Especificaciones funcionales :clipboard:

## Introducción 🌟
Proyecto Final para la materia de Programación III de la Universidad de Entre Ríos. El proyecto consiste en realizar una API REST para la gestión de reclamos de una concesionaria de automoviles, esta API deberá incluir un sistema de autenticación y autorización con tres perfiles distintos: administrador, empleado y cliente. 
La API Rest debe asegurar un manejo eficiente y seguro de los reclamos, garantizando que cada perfil tenga
acceso únicamente a las funciones correspondientes a sus responsabilidades. Además se espera que sea
segura, eficiente y fácil de integrar con los sistemas actuales de la empresa.  

## Instalación y configuración del proyecto ⚠️

-backend: 
ingresar los siguientes comandos:

```npm i```

Este comando instalara las depedencias necesarias.

Para la conexion con la base de datos: 
Crear un archivo .env en la carpeta Backend con las credenciales de su conexion en Workbench teniendo este modelo:
DB_HOST=localhost  
DB_USER=nombre_usuario  
DB_PASSWORD=contraseña_personal  
DB_NAME=nombre_database_proyecto  
DB_CONNECTION_LIMIT=10  
DB_QUEUE_LIMIT=0  

