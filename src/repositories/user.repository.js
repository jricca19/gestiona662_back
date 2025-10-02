const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const School = require("../models/school.model");
const connectToRedis = require("../services/redis.service");

const getUsers = async () => {
  return await User.find();
};

const findUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  return await User.findById(userId);
};

const findUserByIdWhithCache = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }

  const redisClient = connectToRedis();
  let user = await redisClient.get(`user:${userId}`);
  if (!user) {
    user = await User.findById(userId);
    if (!user) {
      throw new Error(`Usuario ID ${userId} no encontrado.`);
    }
    // personal data expire in 24 hours
    await redisClient.set(`user:${userId}`, JSON.stringify(user), { ex: 86400 });
  }
  return user;
};


const findUserByIdWithSchools = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  return await User.findById(userId)
    .populate("staffProfile.schoolIds", "_id schoolNumber departmentId cityName")
    .lean();
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

const findUserByCI = async (ci) => {
  return await User.findOne({ ci });
};

const isValidPassword = async (password, userPassword) => {
  const result = await bcrypt.compare(password, userPassword);
  return result;
};

const createUser = async (name, lastName, ci, email, password, phoneNumber, role, schoolId) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const roleUpper = role.toUpperCase();

  const newUser = new User({
    name,
    lastName,
    ci,
    email: email.toLowerCase(),
    password: hashedPassword,
    phoneNumber,
    role: roleUpper,
  });

  if (roleUpper === 'STAFF') {
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      throw new Error(`ID de escuela inválido: ${schoolId}`);
    }

    newUser.staffProfile = { schoolIds: [schoolId] };
    await newUser.save();

    const school = await School.findById(schoolId);
    if (!school) {
      throw new Error(`Escuela ID ${schoolId} no encontrada`);
    }

    school.staff.push({
      userId: newUser._id,
      role: 'SECONDARY',
      assignedAt: new Date(),
    });

    await school.save();
  } else {
    await newUser.save();
  }
  return newUser;
};

const deleteUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  const result = await User.deleteOne({ _id: userId });
  const redisClient = connectToRedis();
  await redisClient.del(`user:${userId}`);
  return result;
};

const updateUser = async (userId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  const user = await findUserById(userId);
  Object.entries(payload).forEach(([key, value]) => {
    if (key in user) {
      user[key] = value;
    }
  });
  const result = await user.save({ validateModifiedOnly: true });
  const redisClient = connectToRedis();
  await redisClient.del(`user:${user._id}`);
  return result;
};

const updateTeacher = async (userId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  const user = await findUserById(userId);
  if (!user.teacherProfile) {
    user.teacherProfile = {};
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (key in user.teacherProfile) {
      user.teacherProfile[key] = value;
    }
  });
  const result = await user.save({ validateModifiedOnly: true });
  const redisClient = connectToRedis();
  await redisClient.del(`user:${user._id}`);
  return result;
};

const addSchoolToUserProfile = async (userId, schoolId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(schoolId)) {
    throw new Error(`ID de escuela inválido: ${schoolId}`);
  }
  const user = await findUserById(userId);

  if (!user?.staffProfile?.schoolIds.includes(schoolId)) {
    user.staffProfile.schoolIds.push(schoolId);
    const result = await user.save();
    const redisClient = connectToRedis();
    await redisClient.del(`user:${user._id}`);
    return result;
  }
  return;
};

const removeSchoolFromUserProfiles = async (schoolId) => {
  if (!mongoose.Types.ObjectId.isValid(schoolId)) {
    throw new Error(`ID de escuela inválido: ${schoolId}`);
  }
  const result = await User.updateMany(
    { "staffProfile.schoolIds": schoolId },
    { $pull: { "staffProfile.schoolIds": schoolId } }
  );
  const redisClient = connectToRedis();
  const keys = await redisClient.keys('user:*');
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
  return result;
};

module.exports = {
  getUsers,
  findUserById,
  findUserByIdWhithCache,
  findUserByIdWithSchools,
  findUserByEmail,
  findUserByCI,
  isValidPassword,
  createUser,
  deleteUser,
  updateUser,
  updateTeacher,
  addSchoolToUserProfile,
  removeSchoolFromUserProfiles,
};