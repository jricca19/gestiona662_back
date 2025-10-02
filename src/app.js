require("dotenv").config();
require("./jobs/expirePublications.job");
const Sentry = require("./utils/instrument");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const authMiddleWare = require("./middlewares/auth.middleware");
const xssMiddleware = require("./middlewares/xss.middleware");
const privateRouter = require("./routes/private.router");
const publicRouter = require("./routes/public.router");
const authRouter = require("./routes/auth.router");
const connectMongoDB = require("./models/mongo.client");
const connectToRedis = require("./services/redis.service");
const errorMiddleware = require("./middlewares/error.middleware");

(async () => {
  try {
    await connectMongoDB();
  } catch (error) {
    Sentry.captureException(error);
    console.error("Ha ocurrido un error al intentar conectarse a MongoDB: ", error);
    await Sentry.flush(2000);
    process.exit(1);
  }
})();

(async () => {
  try {
    await connectToRedis();
    console.log("Conexión a redis establecida correctamente");
  } catch (error) {
    Sentry.captureException(error);
    console.error("Ha ocurrido un error al intentar conectarse a Redis: ", error);
    await Sentry.flush(2000);
    process.exit(1);
  }
})();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(xssMiddleware);

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean);
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Public
app.use("/", publicRouter);
app.use("/v1/auth", authRouter);

app.use(authMiddleWare);

// Private
app.use("/v1", privateRouter);

// Error middleware
app.use(errorMiddleware);

Sentry.setupExpressErrorHandler(app);

module.exports = app;