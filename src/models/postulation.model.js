const mongoose = require("mongoose");
const postulationSchema = require("./schemas/postulation.schema");
const Postulation = mongoose.model("Postulation", postulationSchema);

module.exports = Postulation;