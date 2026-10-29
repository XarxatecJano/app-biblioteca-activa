# Especificación Técnica - App Activa Biblioteca

## Tecnologías

### Frontend
- **HTML5**: Estructura y marcado semántico
- **CSS3**: Estilos y diseño responsivo
- **TypeScript**: Lógica de cliente con tipado estático

### Backend
- **TypeScript**: Implementación del servidor y lógica de negocio

### Base de Datos
- **PostgreSQL**: Sistema de gestión de datos relacional

---

## Arquitectura

Se sigue el patrón **MVC (Model-View-Controller)**:

- **Model**: Capas de acceso a datos y lógica de negocio (PostgreSQL)
- **View**: Interfaz de usuario (HTML + CSS)
- **Controller**: Lógica de coordinación entre vistas y modelos (TypeScript)

Esta arquitectura separa responsabilidades y facilita el mantenimiento y escalabilidad de la aplicación.

---

## Base de Datos

### Esquema Relacional

#### Tablas Principales

**User**
- Gestiona información de usuarios (miembros, empleados)
- Campos: id, nombre, apellidos, email, DNI, dirección completa, teléfono, rol, estado, fecha nacimiento

**Item**
- Catálogo de libros y materiales de la biblioteca
- Campos: id, título, editorial, ISBN, edición, fecha publicación, sinopsis, ubicación, estado, calidad, idioma, extensión, país, tipo

**Loan**
- Registro de préstamos realizados
- Campos: id, id_user, id_item, fecha inicio, fecha fin, fecha devolución, observaciones, gestionado por

**Reservation**
- Reservas de ítems por usuarios
- Campos: id, id_item, id_user, observaciones, estado

**Request**
- Solicitudes de usuarios (adquisición, mantenimiento, etc.)
- Campos: id, id_user, descripción, estado, creado por, actualizado por, gestionado por

**Sanction**
- Sanciones aplicadas a usuarios (multas, restricciones)
- Campos: id, id_user, id_loan, días penalización, tipo, estado, observaciones

**Audit_log**
- Registro de auditoría de cambios en la BD
- Campos: id, id_user, tabla afectada, id registro, operación, datos anteriores, datos nuevos, timestamp

**Writer**
- Autores de los ítems
- Campos: id, nombre, apellidos, país, fecha nacimiento

**Genre**
- Géneros literarios disponibles
- Campos: id, nombre

#### Tablas Relacionales (Many-to-Many)

**Item_writer_rel**
- Relación entre ítems y autores

**Item_genre_rel**
- Relación entre ítems y géneros

### Relaciones Clave

- Un **Usuario** puede tener múltiples **Préstamos**, **Reservas**, **Solicitudes** y **Sanciones**
- Un **Ítem** puede tener múltiples **Préstamos**, **Reservas**, varios **Autores** y **Géneros**
- Los **Préstamos** registran quién realiza la gestión (employee/admin)
- El **Audit Log** rastrea cambios en cualquier tabla

---

## Descripción General

App Activa Biblioteca es un sistema de gestión integral para bibliotecas que permite:

- Administrar catálogo de libros y materiales
- Gestionar préstamos y devoluciones
- Manejar reservas de ítems
- Registrar sanciones a usuarios
- Procesar solicitudes de usuarios
- Mantener auditoría de cambios
- Gestionar información de usuarios y autores
