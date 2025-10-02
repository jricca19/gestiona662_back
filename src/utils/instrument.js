const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    serviceName: process.env.SENTRY_SERVICE_NAME || 'default-server',
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
    sendDefaultPii: true,
});

// Capture unhandled exceptions and promise rejections
process.on('uncaughtException', (err) => {
    Sentry.captureException(err);
    console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    Sentry.captureException(reason);
    console.error('Unhandled Rejection:', reason);
});

module.exports = Sentry;