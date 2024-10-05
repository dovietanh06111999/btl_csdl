const mongoose = require("mongoose");

const accessRecordSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: Date, required: true },
    location: { type: String, required: true },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

const AccessRecord = mongoose.model("AccessRecord", accessRecordSchema);
module.exports = AccessRecord;
