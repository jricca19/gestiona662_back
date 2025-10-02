const mongoose = require("mongoose");
const Department = require("../models/department.model");

const getDepartments = async () => {
    return await Department.find().select("_id name");
};

const findDepartmentById = async (departmentId) => {
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        throw new Error(`No existe ID: ${departmentId}`);
    }
    return await Department.findById(departmentId).select("_id name cities");
};

const findCityByName = async (departmentId, cityName) => {
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        throw new Error(`No existe ID: ${departmentId}`);
    }
    const department = await Department.findById(departmentId).select("cities");
    if (!department) {
        throw new Error(`No existe departamento con ID: ${departmentId}`);
    }
    return department.cities.find(city => city.name === cityName.trim().toUpperCase());
};

module.exports = {
    getDepartments,
    findDepartmentById,
    findCityByName,
};

