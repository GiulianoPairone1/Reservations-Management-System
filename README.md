---Características Principales (Features)

El sistema está dividido en accesos basados en roles (RBAC) para garantizar la seguridad y privacidad de la información:

---Seguridad y Autenticación

Login Seguro: Implementación de JSON Web Tokens (JWT) para el manejo de sesiones.

Protección de Datos: Encriptación de contraseñas utilizando BCrypt.

Control de Acceso: Vistas y endpoints protegidos según el rol del usuario logueado.

---Panel de Administración (Manager Dashboard)

Gestión Global: ABM (Alta, Baja y Modificación) de profesionales de la salud (Doctores) y nuevo personal administrativo.

Control de Agenda Maestra: Creación de bloques de turnos (intervalos exactos de 30 minutos) asignados a profesionales específicos.

Reprogramación: Herramientas para editar, reasignar o cancelar turnos existentes de forma dinámica.

Buscador Integral: Acceso rápido al historial clínico de pacientes mediante DNI o matrícula del profesional.

---Panel del Profesional (Doctor Dashboard)

Mi Agenda: Visualización en tiempo real de los turnos diarios y próximos, con filtros por estado (Pendiente, Atendido, Ausente, Cancelado).

Gestión de Consultas: Capacidad de cambiar el estado de los turnos en vivo.

Historia Clínica Digital: Ingreso de motivos de consulta, notas administrativas y carga del diagnóstico/devolución del paciente en cada sesión.

---Stack Tecnológico

Frontend:

Librería Core: React.js (Vite)

Estilos: Vanilla CSS (Modularizado y centralizado para componentes reutilizables, garantizando un código limpio y sin dependencias externas pesadas).

Renderizado: Single Page Application (SPA) con transiciones suaves y manejo de estados dinámicos.

Backend:

Framework: C# .NET 8 (ASP.NET Core Web API)

Arquitectura: Clean Architecture (Separación de responsabilidades, escalabilidad y fácil mantenimiento).

Seguridad: Autenticación JWT y BCrypt.

Base de Datos:

Motor: MySQL (Modelado e integración a través de Entity Framework Core / herramientas ORM y diseño en MySQL Workbench).

---Buenas Prácticas Aplicadas

Clean Architecture: Separación clara entre la capa de presentación (Controladores), la lógica de negocio (Servicios) y el acceso a datos.

Componentización: Desarrollo frontend basado en componentes reutilizables (DRY) para formularios, modales y listas.

UX/UI: Diseño responsivo, manejo de estados de carga (Loaders), prevención de errores de usuario y notificaciones visuales (Alertas de éxito/error).
