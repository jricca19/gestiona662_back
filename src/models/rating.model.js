const mongoose = require("mongoose");
const ratingSchema = require("./schemas/rating.schema");
const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;