# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Descripción General

**App Activa Biblioteca** es un sistema de gestión de bibliotecas que maneja préstamos de libros, reservas, gestión de usuarios, sanciones y solicitudes de adquisición. La aplicación utiliza una arquitectura **Modelo-Vista-Controlador (MVC)** con TypeScript, HTML, CSS y PostgreSQL.

> **Estado actual del repositorio**: el proyecto está en fase de diseño. Solo existe la carpeta `docs/` (esquema de BD, casos de uso y especificación técnica). **Aún no hay código fuente, `package.json`, ni sistema de build/test/run definido.** Las secciones marcadas como *previsto* describen convenciones de diseño acordadas, no lo que ya está implementado.

## Arquitectura

### Patrón MVC

- **Modelos**: Capa de datos que gestiona interacciones con PostgreSQL (consultas, lógica de negocio)
- **Vistas**: Interfaz de usuario (plantillas HTML + estilos CSS)
- **Controladores**: Manejadores de solicitudes coordinando entre vistas y modelos

### Base de Datos

- PostgreSQL con 9 tablas principales: `User`, `Item`, `Loan`, `Reservation`, `Request`, `Sanction`, `Audit_log`, `Writer`, `Genre`
- Dos tablas de relación para relaciones muchos-a-muchos: `Item_writer_rel`, `Item_genre_rel`
- Existe una tabla `Audit_log` para registro de auditoría. **Nota:** el seed actual no incluye triggers; el registro de auditoría deberá implementarse en la capa de aplicación (ver *Restricciones Clave*)
- Las claves foráneas están definidas en el seed, pero **ninguna declara `ON DELETE CASCADE`**: el borrado en cascada, si se requiere, debe gestionarse explícitamente
- Ver `docs/TECH_SPEC.md` para documentación completa del esquema
- Seed de base de datos: `docs/seedsql.sql`

### Entidades Clave

**Usuarios**: Miembros, bibliotecarios y administradores con roles y seguimiento de estado
**Ítems**: Libros y materiales con metadatos (ISBN, editorial, idioma, condición)
**Préstamos**: Seguimiento de préstamos con fechas de inicio/fin y devoluciones
**Reservas**: Gestión de colas cuando los ítems no están disponibles
**Sanciones**: Penalizaciones (días de suspensión, multas) asociadas a préstamos
**Solicitudes**: Peticiones de adquisición de usuarios

## Casos de Uso

Los 33 casos de uso están documentados en `docs/casos-de-uso.md`, cubriendo:
- Operaciones principales: préstamos, devoluciones, reservas
- Gestión de usuarios: registro, suspensión, reactivación
- Inventario: registro, eliminación, seguimiento de ubicación
- Sanciones: creación, modificación, cancelación
- Flujos de búsqueda y consulta
- Acceso a registro de auditoría

## Reglas de Negocio

Reglas del dominio que la implementación debe hacer cumplir. Son la fuente de verdad para validaciones en controladores/modelos.

### Préstamos
- **Plazo de devolución**: 15 días naturales desde la fecha de préstamo
- **Máximo de préstamos simultáneos**: 3 por socio

### Reservas
- **Máximo de reservas activas**: 2 por socio

### Sanciones

**Retraso en la devolución**
- Por cada día de retraso: 3 días naturales de suspensión de préstamos (p. ej. 2 días de retraso → 6 días sin poder prestar)

**Sanciones graves** (devolver un ejemplar en mal estado o perderlo), escaladas por reincidencia:
- **1.ª sanción grave**: 30 días naturales sin poder hacer nuevos préstamos
- **2.ª sanción grave**: baneo de 1 año
- **3.ª sanción grave**: baneo permanente (de por vida)

## Desarrollo

### Estructura de Proyecto (a establecer)

```
/src
  /controllers      # Manejadores de solicitudes (TypeScript)
  /models           # Capa de base de datos (TypeScript)
  /views            # Plantillas HTML que renderizan datos
  /utils            # Utilidades compartidas
/public             # Recursos estáticos servidos directamente
  /styles           # Archivos CSS
  /images           # Imágenes
  /pdfs             # Documentos PDF
  *.html            # HTML estático (no vistas de datos: landing, error, etc.)
/docs               # Documentación (seed, casos de uso, especificación técnica)
```

**Convención:** `/src/views` contiene las plantillas HTML que renderizan datos dinámicos; `/public` aloja todo lo estático (CSS, imágenes, PDFs y páginas HTML que no dependen de datos).

### Configuración de Base de Datos

1. Inicializar base de datos PostgreSQL
2. Ejecutar seed: `psql -U <usuario> -d <base_datos> -f docs/seedsql.sql`
3. Verificar esquema con: `psql -U <usuario> -d <base_datos> -c "\dt"`

### Convenciones de Desarrollo (previsto)

Estas son las convenciones acordadas para la futura implementación; todavía no hay código que las aplique.

**Frontend**
- HTML: Marcado semántico siguiendo los 33 casos de uso
- CSS: Diseño responsivo (sin framework CSS presupuesto)
- TypeScript: Manejo de formularios en cliente, validación, gestión de estado

**Backend**
- Controladores TypeScript para manejar solicitudes HTTP
- Consultas PostgreSQL en la capa de modelos con sentencias parametrizadas
- Registro de auditoría: cada operación de modificación debería escribir en `Audit_log` (ID de usuario, nombre de tabla, datos antiguos/nuevos y timestamp), implementado en la capa de aplicación

## Restricciones Clave

Objetivos de diseño que la implementación debe respetar (aún no aplicados en código):

- **Modelo de permisos**: Operaciones (modificar usuarios, sanciones, eliminaciones) restringidas por rol
- **Reglas de negocio**: Validaciones sobre límites de préstamos, sanciones activas y estado de suspensión deben aplicarse en controladores/modelos
- **Registro de auditoría**: Las mutaciones de datos deben registrarse en `Audit_log` desde la capa de aplicación (el seed no incluye triggers que lo hagan automáticamente)
- **Integridad de datos**: Las claves foráneas del seed están definidas pero no aplican cascada; el borrado dependiente debe gestionarse en código según el caso de uso

## Notas Importantes

- El proyecto está en etapa temprana; la estructura de código se establecerá durante la implementación inicial
- La documentación de casos de uso es completa y debe guiar el desarrollo de características
- Referirse a `docs/TECH_SPEC.md` para detalles del stack de tecnologías
