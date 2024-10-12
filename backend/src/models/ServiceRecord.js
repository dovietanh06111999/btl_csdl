const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuildingService",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuildingEmployee",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    income: { type: Number, required: true },
  },
  { timestamps: true }
);

const ServiceRecord = mongoose.model("ServiceRecord", serviceRecordSchema);
module.exports = ServiceRecord;
