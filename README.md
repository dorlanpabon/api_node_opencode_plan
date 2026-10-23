# API de Autenticación — Node.js + Express + MySQL + JWT

API REST de **registro** y **inicio de sesión** (usuario + contraseña) construida con buenas
prácticas: arquitectura por capas, validación de datos, hash de contraseñas, JWT y manejo
centralizado de errores.

> **Nota sobre Node.js:** este proyecto corre sobre **Node.js 24 LTS** (Active LTS desde octubre de 2025,
> verificado con v24.22.0). El requisito se declara como `>= 22` para mantener compatibilidad con
> versiones LTS previas si alguien más clona el proyecto con un entorno distinto.

## ¿Qué queremos lograr?

- Registrar usuarios con credenciales (usuario/clave) almacenando la contraseña **hasheada** (con `bcryptjs`).
- Permitir iniciar sesión y obtener un **access token JWT** para usos futuros (rutas protegidas).
- Validar entradas del usuario (formato, longitud y composición).
- Devolver **respuestas JSON estandarizadas** y **errores claros** con códigos HTTP correctos.
- Probar en Postman con la colección incluida.

## ¿Cómo funciona? (arquitectura)

Patrón por capas ( MVC-like sin vistas, API REST pura):

```
Request → routes → validators → controllers → services → MySQL (pool)
                       ↓                                  ↑
                middlewares (validate)              (bcrypt / jwt en utils)
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Configuración | `src/config/` | Variables de entorno y pool MySQL |
| Rutas | `src/routes/` | Definir endpoints y encadenar middlewares |
| Validadores | `src/validators/` | Reglas de entrada con `express-validator` |
| Controladores | `src/controllers/` | Manejo HTTP: request → respuesta |
| Servicios | `src/services/` | Lógica de negocio (bcrypt, consultas, JWT) |
| Middlewares | `src/middlewares/` | Validación, auth JWT, manejo de errores |
| Utilidades | `src/utils/` | Helpers JWT / respuestas / errores MySQL |

## Requisitos

- **Node.js** ≥ 22 (probado con el LTS actual; compatible con 24)
- **npm** ≥ 10
- **XAMPP** con MySQL en ejecución (panel de control → Start en MySQL)
- **Postman** (para probar, opcional)

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno y ajustar valores
cp .env.example .env   # Windows CMD: copy .env.example .env

# 3. Crear la base de datos y la tabla users (una sola vez)
#    Con phpMyAdmin (http://localhost/phpmyadmin) o mysql CLI:
mysql -u root < database/scripts/init.sql
```

## Ejecución

```bash
# Modo desarrollo (recarga automática con nodemon)
npm run dev

# Modo producción
npm start
```

Verás algo como:

```
✔ Conexión a MySQL verificada
✔ Servidor corriendo en http://localhost:3000 (development)
```

## Variables de entorno (`.env`)

| Variable         | Descripción                          | Ejemplo                |
|------------------|--------------------------------------|------------------------|
| `PORT`           | Puerto HTTP                          | `3000`                 |
| `NODE_ENV`       | Entorno                              | `development`          |
| `DB_HOST`        | Host de MySQL                        | `localhost`            |
| `DB_PORT`        | Puerto de MySQL                      | `3306`                 |
| `DB_USER`        | Usuario MySQL                        | `root` (XAMPP)         |
| `DB_PASSWORD`    | Contraseña MySQL                     | *(vacía en XAMPP)*     |
| `DB_NAME`        | Base de datos                        | `api_auth_db`          |
| `JWT_SECRET`     | Secreto para firmar tokens (**cámbialo**) | cadena larga y aleatoria |
| `JWT_EXPIRES_IN` | Duración del token                   | `1h`                   |
| `CORS_ORIGIN`    | Orígenes permitidos (coma para varios) | `*` (solo dev) o `http://localhost:5173` |

## Endpoints

Base URL: `http://localhost:3000`

### `GET /health`
Comprueba que la API está corriendo.

```json
{ "success": true, "message": "API funcionando correctamente", "data": null }
```

### `POST /api/auth/register`
Registra un usuario.

**Body:**
```json
{ "username": "usuario1", "password": "password123" }
```

**201 Created:**
```json
{ "success": true, "message": "Usuario registrado con éxito", "data": { "id": 1, "username": "usuario1" } }
```

**Errores:** `409` usuario ya existe · `422` validación (username 3–50 caracteres alfanuméricos `._-`; password 8–100).

### `POST /api/auth/login`
Inicia sesión y devuelve el token.

**Body:** igual que register (usuario existente).

**200 OK:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "username": "usuario1" }
  }
}
```

**Errores:** `401` credenciales inválidas · `422` validación.

### Formato de respuesta
Todas las respuestas comparten el mismo envelope:
- Éxito: `{ "success": true, "message": "...", "data": {...} }`
- Error: `{ "success": false, "message": "...", "errors": [...] | null }`

## Probar con Postman

1. Importa `postman/auth-api.postman_collection.json` en Postman (**Import** → archivo).
2. La colección usa la variable `{{baseUrl}}` (por defecto `http://localhost:3000/api`).
3. Ejecuta en orden: **Health** → **Register** → **Login**.
4. Al hacer **Login**, un *test script* guarda el token en la variable de colección `{{token}}`,
   lista para usarse en futuras rutas protegidas (`Authorization: Bearer {{token}}`).

## Seguridad implementada

- **Contraseñas** hasheadas con `bcryptjs` (10 salt rounds); nunca se almacenan ni devuelven en claro.
- **SQL Injection** mitigado: todas las consultas usan placeholders `?`.
- **Timing de login** uniforme: comparación contra hash dummy si el usuario no existe (evita enumerar usuarios por latencia).
- **Cabeceras HTTP** de seguridad automáticas con `helmet`.
- **CORS** configurable por variable de entorno.
- **JWT** firmado y con expiración (access token de vida corta); payload mínimo (`sub`, `username`).
- **Secretos y credenciales** fuera del código (`.env` ignorado por git; se incluye `.env.example` de referencia).
- **Errores** centralizados: el cliente ve mensajes claros y el detalle interno queda en el log del servidor.

## Dependencias

| Paquete             | Propósito                                       |
|---------------------|-------------------------------------------------|
| `express`           | Framework web                                   |
| `mysql2`            | Driver MySQL (promesas + pool)                  |
| `bcryptjs`          | Hash de contraseñas                             |
| `jsonwebtoken`      | Crear/verificar JWT                             |
| `express-validator` | Validación del body                             |
| `helmet`            | Cabeceras de seguridad                          |
| `cors`              | Control de orígenes                             |
| `morgan`            | Logs de peticiones HTTP (dev)                   |
| `dotenv`            | Carga del `.env`                                |
| `nodemon` (dev)     | Reinicio automático en desarrollo               |

## Próximos pasos sugeridos

- Refresh tokens para renovar el access token sin volver a pedir credenciales.
- Middleware `requireAuth` (ya incluido en `src/middlewares/auth.js`) aplicado a rutas privadas.
- Rate limiting en login (p. ej. `express-rate-limit`) contra ataques de fuerza bruta.
- Migraciones versionadas de BD en lugar de un único script SQL.
- Tests automatizados (unitarios de services + integración con supertest).
