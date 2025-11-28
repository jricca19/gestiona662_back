const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");

const publicRouter = express.Router();

const { healthController, getDepartmentsController, getDepartmentController, getSchoolsSelectController, postSchoolController } = require("../controllers/public.controller");
const { expirePublicationsTask } = require("../jobs/expirePublications.job");

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
publicRouter.post("/internal/cron/expire-publications", async (req, res) => {
  try {
    const vercelCronHeader = req.headers["x-vercel-cron"];
    if (!vercelCronHeader) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const result = await expirePublicationsTask();
    res.json({ ok: true, ...result });
  } catch (error) {
    console.error("Error ejecutando expirePublicationsTask:", error);
    res.status(500).json({ ok: false, error: error });
  }
});

module.exports = publicRouter;


