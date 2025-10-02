const Sentry = require("../utils/instrument");

const errorMiddleware = (err, req, res, next) => {
    // Captura el error en Sentry
    Sentry.captureException(err);

    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Error interno del servidor",
    });
};

module.exports = errorMiddleware;
