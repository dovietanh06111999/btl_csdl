const CompanyModel = require("../models/Company");

const calculateMonthlyCosts = async (req, res) => {
  try {
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // Nhận giá trị limit từ query parameters (mặc định là 10 nếu không có)
    const limit = parseInt(req.query.limit, 10) || 10;

    const companies = await CompanyModel.aggregate([
      {
        $lookup: {
          from: "serviceRecords",
          let: { companyId: "$_id" },
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
              $unwind: {
                path: "$serviceDetails",
                preserveNullAndEmptyArrays: true,
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
                          { $min: ["$endDate", currentDate] }, // Giới hạn đến ngày hiện tại
                          "$startDate",
                        ],
                      },
                      { $divide: ["$serviceDetails.unitPrice", daysInMonth] },
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
          billByMonth: {
            $map: {
              input: "$serviceRecords",
              as: "record",
              in: {
                month: { $add: ["$$record._id.month", 0] },
                year: { $add: ["$$record._id.year", 0] },
                total: "$$record.totalServiceBill",
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          area: 1,
          billByMonth: {
            $filter: {
              input: "$billByMonth",
              as: "monthData",
              cond: { $gt: ["$$monthData.total", 0] }, // Chỉ lấy các tháng có tổng > 0
            },
          },
          areaCost: {
            $multiply: ["$area", 1000], // Giả sử đơn giá cho mỗi m2 là 1000
          },
        },
      },
      {
        $addFields: {
          totalServiceCost: { $sum: "$billByMonth.total" },
          totalCost: {
            $add: [
              { $multiply: ["$area", 1000] }, // Tiền thuê mặt bằng
              { $sum: "$billByMonth.total" }, // Tổng tiền dịch vụ
            ],
          },
        },
      },
      {
        $sort: {
          totalCost: -1, // Sắp xếp theo tổng chi phí giảm dần
        },
      },
      {
        $limit: limit, // Giới hạn số lượng bản ghi trả về
      },
    ]);

    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tính toán chi phí" });
  }
};

module.exports = { calculateMonthlyCosts };
