const EmployeeModel = require("../models/Employee");
const BuildingEmployeeModel = require("../models/BuildingEmployee");

const getEmployeeAccessInfo = async (req, res) => {
  try {
    // Lấy ngày từ req.query, nếu không có thì sử dụng ngày hiện tại
    const { date, limit } = req.query; // Thêm limit vào đây
    const targetDate = date ? new Date(date) : new Date(); // Chuyển đổi string thành Date hoặc lấy ngày hiện tại

    // Tính toán startOfDay và endOfDay dựa trên targetDate
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const employeeAccessInfo = await EmployeeModel.aggregate([
      {
        $lookup: {
          from: "companies", // tên collection Company
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
        $limit: limit ? parseInt(limit) : 0, // Chỉ định giới hạn bản ghi nếu có
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
    // Lấy thông tin tháng, năm và số lượng bản ghi từ query (hoặc mặc định là tháng và năm hiện tại)
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng bản ghi trả về (mặc định 10)

    const employeeSalaryInfo = await BuildingEmployeeModel.aggregate([
      {
        $lookup: {
          from: "salaryrecords", // Tên collection lương
          let: { employeeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$employeeId", "$$employeeId"] },
                    { $eq: [{ $month: "$month" }, month] }, // So sánh tháng
                    { $eq: [{ $year: "$month" }, year] }, // So sánh năm
                  ],
                },
              },
            },
          ],
          as: "salaryInfo",
        },
      },
      {
        $unwind: { path: "$salaryInfo", preserveNullAndEmptyArrays: true }, // Gộp thông tin lương
      },
      {
        $lookup: {
          from: "servicerecords", // Tên collection dịch vụ
          localField: "_id",
          foreignField: "employeeId",
          as: "serviceRecords",
        },
      },
      {
        $project: {
          employeeId: "$_id",
          name: 1,
          phone: 1,
          position: 1,
          role: 1,
          monthlySalary: { $ifNull: ["$salaryInfo.salaryAmount", 0] }, // Lương tháng (nếu không có thì 0)
          servicesProvided: "$serviceRecords.serviceType", // Dịch vụ đã cung cấp
        },
      },
      {
        $limit: limit, // Giới hạn số lượng bản ghi
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
