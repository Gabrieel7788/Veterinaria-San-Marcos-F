# Veterinaria San Marcos — Sistema de Gestión Veterinaria

## Descripción del proyecto

Aplicación web desarrollada para la gestión de una clínica veterinaria. Permite administrar usuarios, registrar mascotas, consultar historiales clínicos y gestionar solicitudes de citas según el rol de cada usuario.

Proyecto desarrollado para la asignatura **Desarrollo Fullstack II (DSY1104)**, Evaluación Parcial 3.

## Tecnologías utilizadas

**Frontend:** React, TypeScript, Vite, React Router y Bootstrap.

**Backend:** Java, Spring Boot, Spring Security y API REST.

**Base de datos:** MySQL, con migraciones gestionadas mediante Flyway.

**Seguridad:** autenticación JWT y control de acceso basado en roles.

**Documentación:** Swagger/OpenAPI.

## Roles del sistema

### Administrador
- Gestión de usuarios y asignación de roles.
- Activación y desactivación de cuentas.
- Acceso a funciones administrativas.
- Consulta de reportes y gestión clínica.

### Recepcionista
- Consulta y gestión de solicitudes de citas.
- Confirmación y reagendamiento de citas.
- Registro y consulta de fichas clínicas.

### Dueño de mascota
- Registro e inicio de sesión.
- Gestión de sus mascotas.
- Solicitud y consulta de citas.
- Consulta de historial clínico y avisos de vacunación.

## Arquitectura

El frontend React consume tres microservicios independientes mediante API REST:

| Microservicio | Puerto local | Responsabilidad |
|---|---|---|
| usuarios-service | 8080 | Autenticación y administración de usuarios |
| mascotas-service | 8081 | Mascotas e historial clínico |
| citas-service | 8082 | Solicitudes y gestión de citas |

Cada microservicio utiliza su propia base de datos MySQL.

## Ejecución local del frontend

**Requisitos:** Node.js y npm.

1. Clonar el repositorio.
2. Abrir la carpeta del proyecto en una terminal.
3. Instalar las dependencias:

   `npm install`

4. Iniciar el servidor de desarrollo:

   `npm run dev`

5. Abrir `http://localhost:5173`.

Para utilizar las funciones de autenticación, mascotas y citas, deben estar ejecutándose los tres microservicios y sus respectivas bases de datos.

## Seguridad

El sistema utiliza JWT para autenticar las solicitudes al backend. La interfaz restringe funciones según el rol del usuario y los microservicios validan los permisos de acceso a recursos protegidos.

## Documentación del backend

Repositorio: https://github.com/Gabrieel7788/Veterinaria-San-Marcos-Backend

Swagger local:

- Usuarios: `http://localhost:8080/swagger-ui/index.html`
- Mascotas: `http://localhost:8081/swagger-ui/index.html`
- Citas: `http://localhost:8082/swagger-ui/index.html`

## Repositorios

- Frontend: https://github.com/Gabrieel7788/Veterinaria-San-Marcos-F
- Backend: https://github.com/Gabrieel7788/Veterinaria-San-Marcos-Backend

## Contexto académico

Proyecto de Evaluación Parcial 3 — Desarrollo Fullstack II (DSY1104), Duoc UC.