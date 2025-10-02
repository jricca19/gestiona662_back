const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
  findUserByCI,
  isValidPassword,
} = require("../repositories/user.repository");

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

const postAuthLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const isValidPass = await isValidPassword(password, user.password);
    if (!isValidPass) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, }, AUTH_SECRET_KEY, { expiresIn: "24h", });
    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

const validDocument = (ci) => {
  const weights = [2, 9, 8, 7, 6, 3, 4];
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += parseInt(ci[i]) * weights[i];
  }
  const remainder = sum % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;
  return checkDigit === parseInt(ci[7]);
};

const postAuthSignUp = async (req, res, next) => {
  try {
    const { name, lastName, ci, email, password, phoneNumber, role, schoolId } = req.body;

    const user = await findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: "Correo electrónico ya registrado" });
    }

    const existingCI = await findUserByCI(ci);
    if (existingCI) {
      return res.status(400).json({ message: "Cédula de identidad ya registrada" });
    }

    if (!validDocument(ci)) {
      return res.status(400).json({ message: "Cédula de identidad inválida" });
    }

    let newUser;

    if (role === "STAFF") {
      newUser = await createUser(name, lastName, ci, email, password, phoneNumber, role, schoolId);
    } else {
      newUser = await createUser(name, lastName, ci, email, password, phoneNumber, role);
    }

    if (!newUser) {
      return res.status(500).json({ message: "Error al crear el usuario" });
    }

    const token = jwt.sign({ userId: newUser._id }, AUTH_SECRET_KEY, { expiresIn: "24h" });

    res.status(201).json({ message: "Usuario creado exitosamente", token: token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postAuthLogin,
  postAuthSignUp,
};
