const mongoose = require("mongoose");

const salaryRecordSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuildingEmployee",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuildingService",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    month: { type: Date, required: true },
    serviceType: { type: String, required: true },
    salaryAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const SalaryRecord = mongoose.model("SalaryRecord", salaryRecordSchema);
module.exports = SalaryRecord;
