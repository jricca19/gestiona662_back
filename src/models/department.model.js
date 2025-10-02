const mongoose = require('mongoose');
const departmentSchema = require('./schemas/department.schema');
const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
