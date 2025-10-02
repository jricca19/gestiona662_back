const express = require("express");
const privateRouter = express.Router();

const {
    getPublicationsController,
    getPublicationController,
    postPublicationController,
    assignPostulationController,
    deletePublicationController,
    putPublicationController,
    getSchoolPublicationsController
} = require("../controllers/publications.controller");

const {
    getSchoolsController,
    getSchoolsOfUserController,
    getSchoolController,
    postSchoolController,
    deleteSchoolController,
    putSchoolController,
} = require("../controllers/schools.controller");

const {
    getPostulationController,
    postPostulationController,
    deletePostulationController,
    putPostulationController,
    getUserPostulationsOfUserController,
    getPostulationsOfPublicationController,
} = require("../controllers/postulations.controller");

const {
    getRatingController,
    deleteRatingController,
    getRatingsByUserController,
    postRatingController,
} = require("../controllers/ratings.controller");

const { putTeacherProfile, putUserProfile, getUserProfile } = require("../controllers/user.controller");

const payloadMiddleWare = require("../middlewares/payload.middleware");
const { createPublicationSchema, updatePublicationSchema, getUserPublicationsSchema } = require("./validations/publication.validation");
const { createPostulationSchema, updatePostulationSchema } = require("./validations/postulation.validation");
const { updateUserValidationSchema, updateTeacherValidationSchema } = require("./validations/user.validation");
const { ratingValidationSchema, ratingsValidationSchema } = require("./validations/rating.validation");
const roleMiddleware = require("../middlewares/role.middleware");
const { schoolValidationSchema, updateSchoolValidationSchema } = require("./validations/school.validation");
//
privateRouter.get("/publications", roleMiddleware("TEACHER"), getPublicationsController);
privateRouter.post("/publications/school", roleMiddleware("STAFF"), payloadMiddleWare(getUserPublicationsSchema), getSchoolPublicationsController);
privateRouter.get("/publications/:id", getPublicationController);
privateRouter.post("/publications", roleMiddleware("STAFF"), payloadMiddleWare(createPublicationSchema), postPublicationController);
privateRouter.delete("/publications/:id", roleMiddleware("STAFF"), deletePublicationController);
privateRouter.put("/publications/:id", roleMiddleware("STAFF"), payloadMiddleWare(updatePublicationSchema), putPublicationController);
privateRouter.patch("/publications/assignPostulation/multiple", roleMiddleware("STAFF"), assignPostulationController);

privateRouter.get("/postulations/user", roleMiddleware("TEACHER"), getUserPostulationsOfUserController);
privateRouter.get("/postulations/publication/:id", roleMiddleware("STAFF"), getPostulationsOfPublicationController);
privateRouter.get("/postulations/:id", getPostulationController);
privateRouter.post("/postulations", roleMiddleware("TEACHER"), payloadMiddleWare(createPostulationSchema), postPostulationController);
privateRouter.delete("/postulations/:id", roleMiddleware("TEACHER"), deletePostulationController);
privateRouter.put("/postulations/:id", roleMiddleware("TEACHER"), payloadMiddleWare(updatePostulationSchema), putPostulationController);

privateRouter.get("/schools", getSchoolsController);
privateRouter.get("/schools/user", roleMiddleware("STAFF"), getSchoolsOfUserController);
privateRouter.get("/schools/:id", getSchoolController);
privateRouter.post("/schools", roleMiddleware("STAFF"), payloadMiddleWare(schoolValidationSchema), postSchoolController);
privateRouter.delete("/schools/:id", roleMiddleware("STAFF"), deleteSchoolController);
privateRouter.put("/schools/:id", roleMiddleware("STAFF"), payloadMiddleWare(updateSchoolValidationSchema), putSchoolController);

privateRouter.get("/ratings/user", payloadMiddleWare(ratingsValidationSchema), getRatingsByUserController);
privateRouter.get("/ratings/:id", getRatingController);
privateRouter.post("/ratings", payloadMiddleWare(ratingValidationSchema), postRatingController);
privateRouter.delete("/ratings/:id", deleteRatingController);

privateRouter.get("/users/profile", getUserProfile);
privateRouter.put("/users/profileTeacher", roleMiddleware("TEACHER"), payloadMiddleWare(updateTeacherValidationSchema), putTeacherProfile);
privateRouter.put("/users/profile", payloadMiddleWare(updateUserValidationSchema), putUserProfile);

module.exports = privateRouter;