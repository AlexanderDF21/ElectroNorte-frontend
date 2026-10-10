# ElectroNorte — Frontend

## Descripción del proyecto

Frontend del sistema **Mesa de Ayuda para la Gestión de Incidencias del Servicio de Energía Eléctrica**, desarrollado para ElectroNorte S.A.

La aplicación permite gestionar incidencias del servicio eléctrico mediante una interfaz web, con funcionalidades según los roles de usuario, técnico y administrador.

## Tecnologías utilizadas

- Angular 22
- TypeScript
- HTML y CSS
- API REST
- Azure Static Web Apps

## Requisitos previos

Para ejecutar el frontend localmente se necesita:

- Node.js y npm compatibles con Angular 22.
- Visual Studio Code u otro editor de código.
- Acceso al backend de ElectroNorte, local o desplegado.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/AlexanderDF21/ElectroNorte-frontend.git
```

**2. Ingresar al proyecto**

```bash
cd ElectroNorte-frontend
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Configurar la conexión con el backend**

Verificar que la URL base de la API REST utilizada por los servicios Angular apunte al backend correspondiente.

Backend desplegado en Azure:

```text
https://electronorte-backend-b3bdfmg4cydkh8dg.chilecentral-01.azurewebsites.net
```

La dirección de la API debe configurarse en el archivo correspondiente del proyecto antes de ejecutar la aplicación.

**5. Iniciar el servidor de desarrollo**

```bash
npx ng serve
```

**6. Abrir la aplicación**

Ingresar desde el navegador a:

http://localhost:4200/

## Compilación del proyecto

Para generar la versión de producción:

```bash
npx ng build
```

Los archivos compilados se almacenarán en el directorio `dist/`.

## Estructura principal

```text
src/
└── app/
    ├── components/
    ├── core/
    │   ├── guards/
    │   ├── interceptors/
    │   └── services/
    ├── models/
    ├── pages/
    └── app.routes.ts
```

- **components:** componentes reutilizables de la interfaz.
- **guards:** protección de rutas según autenticación y autorización.
- **interceptors:** procesamiento de solicitudes HTTP.
- **services:** comunicación con la API REST.
- **models:** estructuras de datos utilizadas en Angular.
- **pages:** pantallas del sistema.
- **app.routes.ts:** configuración de rutas.

## Funcionalidades principales

- Inicio de sesión y autenticación.
- Registro de incidencias eléctricas.
- Consulta y seguimiento de incidencias.
- Gestión de incidencias según los roles del sistema.
- Comunicación con el backend mediante API REST.

## Repositorio del backend

El backend está desarrollado con Java 17 y Spring Boot.

https://github.com/AlexanderDF21/ElectroNorte-backend

## Aplicación desplegada en Azure

Frontend:

https://lemon-cliff-0e380020f.6.azurestaticapps.net

Backend:

https://electronorte-backend-b3bdfmg4cydkh8dg.chilecentral-01.azurewebsites.net

## Seguridad

El archivo `.gitignore` excluye dependencias, archivos compilados y archivos locales que puedan contener credenciales.

No se deben publicar contraseñas, tokens ni claves privadas en el repositorio.

## Proyecto académico

Proyecto desarrollado para el curso de Soluciones Web y Aplicaciones Distribuidas.