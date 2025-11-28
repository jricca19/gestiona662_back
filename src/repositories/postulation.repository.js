const mongoose = require("mongoose");
const Postulation = require("../models/postulation.model");
const Publication = require("../models/publication.model");
const connectToRedis = require("../services/redis.service");

const getPostulations = async () => {
  return await Postulation.find()
    .populate({
      path: 'teacherId',
      select: 'name lastName ci email phoneNumber role profilePhoto teacherProfile',
    })
    .lean();
};

const getPostulationsByUserId = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`ID de usuario inválido: ${userId}`);
    }
    return await Postulation.find({ teacherId: userId })
        .populate({
            path: "publicationId",
            select: "grade shift schoolId",
            populate: {
                path: "schoolId",
                select: "schoolNumber address departmentId cityName",
                populate: {
                    path: "departmentId",
                    select: "name"
                }
            }
        })
        .lean();
};

const createPostulation = async (teacherId, publicationId, appliesToAllDays, postulationDays) => {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error(`Maestro con ID ${teacherId} inválido`);
    }
    if (!mongoose.Types.ObjectId.isValid(publicationId)) {
        throw new Error(`Publicación con ID ${publicationId} inválido`);
    }
    const newPostulation = new Postulation({
        teacherId, publicationId, appliesToAllDays, postulationDays
    });
    await newPostulation.save();

    const pub = await Publication.findById(publicationId).select("schoolId").lean();
    if (pub?.schoolId) {
        const redisClient = connectToRedis();
        await redisClient.del(`publications:school:${pub.schoolId.toString()}`);
    }
    return newPostulation;
};

const findDuplicatePostulation = async (teacherId, publicationId) => {
    return await Postulation.findOne({
        teacherId: new mongoose.Types.ObjectId(teacherId),
        publicationId: new mongoose.Types.ObjectId(publicationId)
    }).select("_id");
};

const deletePostulationsByPublicationId = async (publicationId) => {
    await Postulation.deleteMany({ publicationId });

    const pub = await Publication.findById(publicationId).select("schoolId").lean();
    if (pub?.schoolId) {
        const redisClient = connectToRedis();
        await redisClient.del(`publications:school:${pub.schoolId.toString()}`);
    }
}

const findPostulation = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No existe postulación ID: ${id}`);
    }

    return await Postulation.findById(id).populate("postulationDays").select();
};

const deletePostulation = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No existe postulación con ID: ${id}`);
    }
    const post = await Postulation.findById(id).select("publicationId").lean();
    const res = await Postulation.deleteOne({ _id: id });

    if (post?.publicationId) {
        const pub = await Publication.findById(post.publicationId).select("schoolId").lean();
        if (pub?.schoolId) {
            const redisClient = connectToRedis();
            await redisClient.del(`publications:school:${pub.schoolId.toString()}`);
        }
    }
    return res;
};

const updatePostulation = async (id, payload) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No existe postulación con ID: ${id}`);
    }
    const postulation = await Postulation.findOne({ _id: id });

    if (postulation) {
        Object.entries(payload).forEach(([key, value]) => {
            postulation[key] = value;
        });
        await postulation.save();

        const pub = await Publication.findById(postulation.publicationId).select("schoolId").lean();
        if (pub?.schoolId) {
            const redisClient = connectToRedis();
            await redisClient.del(`publications:school:${pub.schoolId.toString()}`);
        }
    }
    return postulation;
};

module.exports = {
    getPostulations,
    getPostulationsByUserId,
    findPostulation,
    createPostulation,
    deletePostulation,
    deletePostulationsByPublicationId,
    updatePostulation,
    findDuplicatePostulation,
};
