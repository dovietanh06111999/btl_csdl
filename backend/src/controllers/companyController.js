const CompanyModel = require("../models/Company");

const calculateMonthlyCosts = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Lấy tháng hiện tại
    const limit = parseInt(req.query.limit, 10) || 10; // Số lượng công ty trả về

    const companies = await CompanyModel.aggregate([
      {
        $match: {
          createdAt: { $lte: currentDate },
        },
      },
      {
        $lookup: {
          from: "serviceRecords",
          let: {
            companyId: "$_id",
            companyEmployees: "$employees",
            companyArea: "$area",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$companyId", "$$companyId"],
                },
              },
            },
            {
              $lookup: {
                from: "buildingServices",
                localField: "serviceId",
                foreignField: "_id",
                as: "serviceDetails",
              },
            },
            {
              $unwind: "$serviceDetails",
            },
            {
              $addFields: {
                adjustedUnitPrice: {
                  $let: {
                    vars: {
                      basePrice: "$serviceDetails.unitPrice",
                      employeeFactor: {
                        $cond: [
                          { $lte: ["$$companyEmployees", 10] },
                          1,
                          {
                            $add: [
                              1,
                              {
                                $multiply: [
                                  0.05,
                                  {
                                    $floor: {
                                      $divide: [
                                        {
                                          $subtract: ["$$companyEmployees", 10],
                                        },
                                        5,
                                      ],
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      areaFactor: {
                        $cond: [
                          { $lte: ["$$companyArea", 100] },
                          1,
                          {
                            $add: [
                              1,
                              {
                                $multiply: [
                                  0.05,
                                  {
                                    $floor: {
                                      $divide: [
                                        { $subtract: ["$$companyArea", 100] },
                                        10,
                                      ],
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    },
                    in: {
                      $multiply: [
                        "$$basePrice",
                        "$$employeeFactor",
                        "$$areaFactor",
                      ],
                    },
                  },
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$startDate" },
                  month: { $month: "$startDate" },
                },
                totalServiceBill: {
                  $sum: {
                    $multiply: [
                      {
                        $subtract: [
                          { $min: ["$endDate", currentDate] },
                          "$startDate",
                        ],
                      },
                      { $divide: ["$adjustedUnitPrice", 30] },
                    ],
                  },
                },
              },
            },
          ],
          as: "serviceRecords",
        },
      },
      {
        $addFields: {
          areaBillByMonth: {
            $map: {
              input: {
                $range: [{ $month: "$createdAt" }, currentMonth + 1],
              },
              as: "month",
              in: {
                year: currentYear,
                month: "$$month",
                areaCost: { $multiply: ["$area", 1000] },
              },
            },
          },
          serviceBillByMonth: {
            $map: {
              input: "$serviceRecords",
              as: "record",
              in: {
                month: { $add: ["$$record._id.month", 0] },
                year: { $add: ["$$record._id.year", 0] },
                totalServiceBill: "$$record.totalServiceBill",
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalBillByMonth: {
            $map: {
              input: "$areaBillByMonth",
              as: "areaMonth",
              in: {
                month: "$$areaMonth.month",
                year: "$$areaMonth.year",
                totalAreaCost: "$$areaMonth.areaCost",
                totalServiceCost: {
                  $reduce: {
                    input: "$serviceBillByMonth",
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ["$$this.month", "$$areaMonth.month"] },
                        { $add: ["$$value", "$$this.totalServiceBill"] },
                        "$$value",
                      ],
                    },
                  },
                },
                totalCost: {
                  $add: [
                    "$$areaMonth.areaCost",
                    {
                      $reduce: {
                        input: "$serviceBillByMonth",
                        initialValue: 0,
                        in: {
                          $cond: [
                            { $eq: ["$$this.month", "$$areaMonth.month"] },
                            { $add: ["$$value", "$$this.totalServiceBill"] },
                            "$$value",
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            name: "$name",
            area: "$area",
          },
          totalBillByMonth: { $push: "$totalBillByMonth" },
        },
      },
      {
        $project: {
          _id: "$_id._id",
          name: "$_id.name",
          area: "$_id.area",
          totalBillByMonth: {
            $reduce: {
              input: "$totalBillByMonth",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
      {
        $sort: {
          "totalBillByMonth.totalCost": -1,
        },
      },
      {
        $limit: limit,
      },
    ]);

    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tính toán chi phí" });
  }
};

module.exports = { calculateMonthlyCosts };
