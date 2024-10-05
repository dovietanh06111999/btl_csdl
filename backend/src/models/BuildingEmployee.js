const mongoose = require("mongoose");

const buildingEmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    role: { type: String, required: true },
    salaryRecords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SalaryRecord" },
    ],
  },
  { timestamps: true }
);

const BuildingEmployee = mongoose.model(
  "BuildingEmployee",
  buildingEmployeeSchema
);
module.exports = BuildingEmployee;
