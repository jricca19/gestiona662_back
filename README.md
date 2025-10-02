# README #

**Gestion de suplencias 662**  
Aplicación backend desarrollada con [Express.js](https://expressjs.com/)

### Requisitos previos
- [Node.js](https://nodejs.org/) instalado (v14 o superior recomendado)
- [npm](https://www.npmjs.com/) (v6 o superior)

### Instalación
1. Clonar el repositorio desde https://github.com/jricca19/gestiona662_back
2. npm install
3. Ejecutar desde terminal la carga de departamentos y ciudades de ./resources/populateDatabase.js:
   node ./resources/populateDatabase.js
4. npm run local (ejecución local) o npm run dev (ejecución para vercel)
### Consideraciones
Verificar variables de entorno en .env para apuntar a conexiones locales o de producción según corresponda.
Verificar llamada en package.json según corresponda ejecutar dev.js o index.js (este ultimo usado para deploy en Vercel).

### Observabilidad
Implementada con sentry (ver src\utils\instrument.js)

### Testing
Para realizar el test se debe instalar k6:
   En windows desde terminal ejecutar--> choco install k6
Configuramos la prueba a realizar en .\resources\loadtest.js
Con el proyecto levantado ejecutamos: k6 run .\resources\loadtest.js -e AUTH_TOKEN="TOKEN_DE_AUTORIZACION"
