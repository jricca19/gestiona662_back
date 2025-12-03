const Department = require("../models/department.model");
const School = require("../models/school.model");
const { getDepartments, findDepartmentById, findCityByName } = require("../repositories/department.repository");
const { createSchool } = require("../repositories/school.repository");
const { expirePublicationsTask } = require("../jobs/expirePublications.job");

const healthController = (req, res) => {
  res.status(200).send({
    message: "Service is running",
  });
};

const getSchoolsSelectController = async (req, res) => {
  try {
    const schools = await School.find({}, '_id schoolNumber cityName');
    res.status(200).send(schools);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener escuelas' });
  }
};

const postSchoolController = async (req, res, next) => {
  try {
    const { schoolNumber, departmentId, cityName, address } = req.body;

    const department = await findDepartmentById(departmentId);
    if (!department) {
      return res.status(404).json({ message: `No se ha encontrado el departamento con id: ${departmentId}` });
    }

    const city = await findCityByName(departmentId, cityName);
    if (!city) {
      return res.status(404).json({ message: `No se ha encontrado la ciudad ${cityName} en el departamento ${department.name}` });
    }

    school = await createSchool(schoolNumber, departmentId, cityName, address);
    return res.status(201).json({
      message: "Escuela creada correctamente",
      school
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentsController = async (req, res) => {
  try {
    const departments = await getDepartments();
    res.status(200).send(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await findDepartmentById(id);
    if (!department) {
      return res.status(404).send({ error: "Department not found" });
    }
    res.status(200).send(department.cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const expirePublicationsController = async (req, res) => {
  try {
    const vercelCronHeader = req.headers["x-vercel-cron"];
    const headerSecret = req.headers["x-cron-secret"];
    const cronSecret = process.env.CRON_SECRET;
    const authorized = Boolean(vercelCronHeader) || (cronSecret ? headerSecret === cronSecret : false);
    if (!authorized) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const result = await expirePublicationsTask();
    return res.json({ ok: true, ...result });
  } catch (error) {
    console.error("Error ejecutando expirePublicationsTask:", error);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
};

module.exports = {
  healthController,
  getDepartmentsController,
  getDepartmentController,
  getSchoolsSelectController,
  postSchoolController,
  expirePublicationsController
};
