const mongoose = require("mongoose");
const publicationSchema = require("./schemas/publication.schema");
const Publication = mongoose.model("Publication", publicationSchema);

module.exports = Publication;
