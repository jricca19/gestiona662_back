const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cities: [citySchema]
});

module.exports = departmentSchema;