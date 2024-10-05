const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    taxId: { type: String, required: true },
    capital: { type: Number, required: true },
    industry: { type: String, required: true },
    numberOfEmployees: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: Number, required: true },
    // serviceRecords: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRecord" },
    // ],
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
