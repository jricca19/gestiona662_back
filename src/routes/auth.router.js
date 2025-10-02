const express = require("express");
const authRouter = express.Router();
const { postAuthLogin, postAuthSignUp, } = require("../controllers/auth.controller");

const payloadMiddleWare = require("../middlewares/payload.middleware");
const { signupValidationSchema, loginValidationSchema } = require("./validations/user.validation");

authRouter.post("/login", payloadMiddleWare(loginValidationSchema), postAuthLogin);
authRouter.post("/signup", payloadMiddleWare(signupValidationSchema), postAuthSignUp);

module.exports = authRouter;