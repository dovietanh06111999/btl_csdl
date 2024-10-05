const express = require("express");
const { calculateMonthlyCosts } = require("../controllers/companyController");
const router = express.Router();

router.get("/monthly-costs", calculateMonthlyCosts);

module.exports = router;
