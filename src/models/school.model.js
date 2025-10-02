const mongoose = require("mongoose");
const schoolSchema = require("./schemas/school.schema");
const School = mongoose.model("School", schoolSchema);

module.exports = School;