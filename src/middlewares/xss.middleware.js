const xss = require("xss");

const xssMiddleware = (req, res, next) => {
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = xss(obj[key]);
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.query) sanitize(req.query);
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);

    next();
};

module.exports = xssMiddleware;