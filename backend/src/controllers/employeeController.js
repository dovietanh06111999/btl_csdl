const EmployeeModel = require("../models/Employee");
const BuildingEmployeeModel = require("../models/BuildingEmployee");

const getEmployeeAccessInfo = async (req, res) => {
  try {
    // Lấy ngày từ req.query, nếu không có thì sử dụng ngày hiện tại
    const { date, limit } = req.query; // Thêm limit vào đây
    const targetDate = date ? new Date(date) : new Date(); // Chuyển đổi string thành Date hoặc lấy ngày hiện tại
    console.log(limit);

    // Tính toán startOfDay và endOfDay dựa trên targetDate
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Chuyển đổi limit thành số nguyên và kiểm tra
    let limitValue = 0; // Giá trị mặc định là 0

    if (limit) {
      limitValue = parseInt(limit, 10); // Chuyển đổi thành số nguyên
      if (isNaN(limitValue) || limitValue < 0) {
        throw new Error("Limit must be a non-negative integer"); // Ném lỗi nếu không hợp lệ
      }
    }

    const employeeAccessInfo = await EmployeeModel.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyInfo",
        },
      },
      {
        $unwind: "$companyInfo", // Phá vỡ mảng thông tin công ty
      },
      {
        $lookup: {
          from: "accessrecords", // tên collection AccessRecord
          let: { employeeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$employeeId", "$$employeeId"] },
                    { $gte: ["$time", startOfDay] }, // Đảm bảo sử dụng đúng trường
                    { $lte: ["$time", endOfDay] },
                  ],
                },
              },
            },
            {
              $project: {
                date: 1, // Lấy trường date
                time: 1, // Lấy trường time
                location: 1, // Lấy trường location
                action: 1, // Lấy trường action
              },
            },
          ],
          as: "accessInfo",
        },
      },
      {
        $project: {
          employeeId: "$_id",
          name: 1,
          phone: 1,
          companyName: "$companyInfo.name",
          accessCount: { $size: "$accessInfo" }, // Số lần truy cập
          accessRecords: { $ifNull: ["$accessInfo", []] }, // Sử dụng accessInfo làm accessRecords
        },
      },
      // Thêm bước giới hạn số lượng bản ghi
      {
        $limit: limitValue, // Chỉ định giới hạn bản ghi nếu có
      },
    ]);

    res.status(200).json(employeeAccessInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy vấn thông tin nhân viên" });
  }
};

const getBuildingEmployeesWithSalary = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const limit = parseInt(req.query.limit) || 10;

    const employeeSalaryInfo = await BuildingEmployeeModel.aggregate([
      {
        $lookup: {
          from: "servicerecords",
          let: { employeeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$employeeId", "$$employeeId"] },
                    { $eq: [{ $month: "$startDate" }, month] },
                    { $eq: [{ $year: "$startDate" }, year] },
                  ],
                },
              },
            },
          ],
          as: "salaryInfo",
        },
      },
      {
        $unwind: { path: "$salaryInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "companies",
          localField: "salaryInfo.companyId",
          foreignField: "_id",
          as: "companyInfo",
        },
      },
      {
        $unwind: { path: "$companyInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "buildingservices",
          localField: "salaryInfo.serviceId",
          foreignField: "_id",
          as: "serviceInfo",
        },
      },
      {
        $unwind: { path: "$serviceInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          employeeId: "$_id",
          name: 1,
          phone: 1,
          position: 1,
          role: 1,
          companyName: { $ifNull: ["$companyInfo.name", "Chưa có công ty"] },
          // Tính toán mức lương hàng tháng dựa trên giá dịch vụ unitPrice
          monthlySalary: {
            $let: {
              vars: {
                baseSalary: "$serviceInfo.unitPrice",
                numberOfEmployees: {
                  $ifNull: ["$companyInfo.numberOfEmployees", 0],
                },
                area: { $ifNull: ["$companyInfo.area", 0] },
                employeeIncrease: {
                  $floor: {
                    $divide: [
                      { $subtract: ["$companyInfo.numberOfEmployees", 10] },
                      5,
                    ],
                  },
                },
                areaIncrease: {
                  $floor: {
                    $divide: [{ $subtract: ["$companyInfo.area", 100] }, 10],
                  },
                },
              },
              in: {
                $multiply: [
                  "$$baseSalary",
                  {
                    $add: [
                      1,
                      { $multiply: ["$$employeeIncrease", 0.05] },
                      { $multiply: ["$$areaIncrease", 0.05] },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $limit: limit,
      },
    ]);

    console.log(employeeSalaryInfo);
    res.status(200).json(employeeSalaryInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy vấn thông tin nhân viên" });
  }
};

module.exports = {
  getEmployeeAccessInfo,
  getBuildingEmployeesWithSalary,
};
