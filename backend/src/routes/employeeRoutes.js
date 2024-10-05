const express = require("express");
const {
  getEmployeeAccessInfo,
  getBuildingEmployeesWithSalary,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/access-info", getEmployeeAccessInfo);
router.get("/salaries", getBuildingEmployeesWithSalary);

module.exports = router;
