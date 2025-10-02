const mongoose = require("mongoose");
require('dotenv').config();

const connectMongoDB = async () => {
  const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
  const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
  const MONGODB_TIMEOUT = process.env.MONGODB_TIMEOUT;

  await mongoose.connect(
    `${MONGODB_CONNECTION_STRING}/${MONGODB_DATABASE_NAME}`,
    {
      serverSelectionTimeoutMS: MONGODB_TIMEOUT,
    }
  );
  console.log("Conexión a MongoDB establecida correctamente");
};

module.exports = connectMongoDB;
