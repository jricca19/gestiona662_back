const mongoose = require("mongoose");
const School = require("../models/school.model");
const connectToRedis = require("../services/redis.service");

const getSchools = async () => {
    const redisClient = connectToRedis();
    let schools = await redisClient.get("schools");

    if (!schools) {
        schools = await School.find().select("-staff");
        await redisClient.set("schools", JSON.stringify(schools));
    }
    return schools;
};

const getSchoolByUserId = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`ID de usuario inválido: ${userId}`);
    }
    const schools = await School.find({ "staff.userId": userId })
    return schools;
}

const findSchool = async (schoolNumber, departmentId, cityName) => {
    return await School.findOne({ schoolNumber, departmentId, cityName: cityName.trim().toUpperCase() });
};

const findSchoolById = async (schoolId) => {
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        throw new Error(`ID de escuela inválido: ${schoolId}`);
    }
    return await School.findById(schoolId);
};

const createSchool = async (schoolNumber, departmentId, cityName, address) => {
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        throw new Error(`ID de departamento inválido: ${departmentId}`);
    }

    const cityNameUpper = cityName.trim().toUpperCase();

    const newSchool = new School({
        schoolNumber,
        departmentId,
        cityName: cityNameUpper,
        address
    });
    await newSchool.save();

    const redisClient = connectToRedis();
    await redisClient.del("schools");

    return newSchool;
};

const deleteSchool = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`ID de escuela inválido: ${id}`);
    }
    const result = await School.deleteOne({ _id: id });

    const redisClient = connectToRedis();
    await redisClient.del("schools");

    return result;
};

const updateSchool = async (school, payload) => {
    Object.entries(payload).forEach(([key, value]) => {
        if (key in school) {
            school[key] = value;
        }
    });
    
    const result = await school.save({ validateModifiedOnly: true });

    const redisClient = connectToRedis();
    await redisClient.del("schools");
    return result;
};

const addUserToSchool = async (userId, school, role) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`ID de usuario inválido: ${userId}`);
    }

    const alreadyInStaff = school.staff.some(
        staff => staff.userId.toString() === userId.toString()
    );
    if (alreadyInStaff) {
        return school;
    }

    const isApproved = role === "PRIMARY" ? true : false;

    // $addToSet to avoid duplicates
    await School.updateOne(
        { _id: school._id },
        {
            $addToSet: {
                staff: {
                    userId,
                    role,
                    isApproved: isApproved,
                    assignedAt: new Date()
                }
            }
        }
    );

    // refresh the school data
    const updatedSchool = await School.findById(school._id);

    const redisClient = connectToRedis();
    await redisClient.del("schools");

    return updatedSchool;
};

module.exports = {
    getSchools,
    getSchoolByUserId,
    findSchool,
    findSchoolById,
    createSchool,
    deleteSchool,
    updateSchool,
    addUserToSchool,
};