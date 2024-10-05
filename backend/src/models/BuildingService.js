const mongoose = require("mongoose");

const buildingServiceSchema = new mongoose.Schema(
  {
    serviceCode: { type: String, required: true },
    serviceName: { type: String, required: true },
    serviceType: { type: String, required: true },
    unitPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const BuildingService = mongoose.model(
  "BuildingService",
  buildingServiceSchema
);
module.exports = BuildingService;
