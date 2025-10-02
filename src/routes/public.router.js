const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");

const publicRouter = express.Router();

const {
  healthController,
  getDepartmentsController,
  getDepartmentController,
  getSchoolsSelectController,
  postSchoolController
} = require("../controllers/public.controller");

// Ruta para servir swagger.json como archivo estático
publicRouter.get("/swagger/swagger.json", (req, res) => {
  const filePath = path.join(__dirname, "../../swagger/swagger.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  res.setHeader("Content-Type", "application/json");
  res.send(jsonData);
});

// Montar Swagger UI y que cargue el archivo desde la ruta servida arriba
publicRouter.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    explorer: true,
    swaggerOptions: {
      url: "/swagger/swagger.json",
    },
    customCssUrl: "https://unpkg.com/swagger-ui-dist/swagger-ui.css",
  })
);

publicRouter.get("/health", healthController);
publicRouter.get("/departments", getDepartmentsController);
publicRouter.get("/departments/:id", getDepartmentController);
publicRouter.get('/schoolsSelect', getSchoolsSelectController);
publicRouter.post('/schools', postSchoolController);

module.exports = publicRouter;