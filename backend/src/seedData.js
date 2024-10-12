const mongoose = require("mongoose");
const Company = require("./models/Company");
const Employee = require("./models/Employee");
const BuildingService = require("./models/BuildingService");
const ServiceRecord = require("./models/ServiceRecord");
const BuildingEmployee = require("./models/BuildingEmployee");
const SalaryRecord = require("./models/SalaryRecord");
const AccessRecord = require("./models/AccessRecord");

const seedData = async () => {
  await mongoose.connect("mongodb://localhost:27017/office_management", {});

  // Xóa tất cả các dữ liệu hiện có
  await Company.deleteMany({});
  await Employee.deleteMany({});
  await BuildingService.deleteMany({});
  await ServiceRecord.deleteMany({});
  await BuildingEmployee.deleteMany({});
  await SalaryRecord.deleteMany({});
  await AccessRecord.deleteMany({});

  // Tạo dữ liệu mẫu

  // Companies
  const company1 = new Company({
    _id: new mongoose.Types.ObjectId(),
    name: "Công ty ABC",
    taxId: "123456789",
    capital: 1000000,
    industry: "Công nghệ thông tin",
    numberOfEmployees: 100,
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0123456789",
    area: 500,
    createdAt: new Date("2024-8-30"),
  });

  const company2 = new Company({
    _id: new mongoose.Types.ObjectId(),
    name: "Công ty XYZ",
    taxId: "987654321",
    capital: 2000000,
    industry: "Dịch vụ",
    numberOfEmployees: 200,
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    phone: "0987654321",
    area: 1000,
    createdAt: new Date("2024-8-30"),
  });

  const company3 = new Company({
    _id: new mongoose.Types.ObjectId(),
    name: "Công ty DEF",
    taxId: "135792468",
    capital: 1500000,
    industry: "Thương mại",
    numberOfEmployees: 150,
    address: "789 Đường DEF, Quận 3, TP.HCM",
    phone: "0345678910",
    area: 600,
    createdAt: new Date("2024-8-30"),
  });

  const company4 = new Company({
    _id: new mongoose.Types.ObjectId(),
    name: "Công ty GHI",
    taxId: "246813579",
    capital: 2500000,
    industry: "Sản xuất",
    numberOfEmployees: 300,
    address: "159 Đường GHI, Quận 4, TP.HCM",
    phone: "0234567890",
    area: 800,
    createdAt: new Date("2024-8-30"),
  });

  const company5 = new Company({
    _id: new mongoose.Types.ObjectId(),
    name: "Công ty JKL",
    taxId: "864209753",
    capital: 1800000,
    industry: "Bán lẻ",
    numberOfEmployees: 120,
    address: "321 Đường JKL, Quận 5, TP.HCM",
    phone: "0456789012",
    area: 700,
    createdAt: new Date("2024-8-30"),
  });

  await Company.insertMany([company1, company2, company3, company4, company5]);

  // Employees
  const employee1 = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: "E001",
    identityCard: "123456789",
    name: "Nguyễn Văn A",
    dob: new Date("1990-01-01"),
    position: "Nhân viên",
    phone: "0123456789",
    email: "a@example.com",
    companyId: company1._id,
  });

  const employee2 = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: "E002",
    identityCard: "987654321",
    name: "Trần Thị B",
    dob: new Date("1992-02-02"),
    position: "Quản lý",
    phone: "0987654321",
    email: "b@example.com",
    companyId: company2._id,
  });

  const employee3 = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: "E003",
    identityCard: "3457358567",
    name: "Lê Văn C",
    dob: new Date("1993-03-03"),
    position: "Giám đốc",
    phone: "56789890",
    email: "c@example.com",
    companyId: company3._id,
  });

  const employee4 = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: "E004",
    identityCard: "1244436321",
    name: "Phạm Thị D",
    dob: new Date("1995-04-04"),
    position: "Nhân viên",
    phone: "0345678910",
    email: "d@example.com",
    companyId: company4._id,
  });

  const employee5 = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: "E005",
    identityCard: "4578566578",
    name: "Ngô Văn E",
    dob: new Date("1996-05-05"),
    position: "Kế toán",
    phone: "0456789012",
    email: "e@example.com",
    companyId: company5._id,
  });

  await Employee.insertMany([
    employee1,
    employee2,
    employee3,
    employee4,
    employee5,
  ]);

  // BuildingServices
  const service1 = new BuildingService({
    _id: new mongoose.Types.ObjectId(),
    serviceCode: "S001",
    serviceName: "Dọn vệ sinh",
    serviceType: "Cleaning",
    unitPrice: 500000,
    description: "Dọn vệ sinh hàng ngày cho tòa nhà",
  });

  const service2 = new BuildingService({
    _id: new mongoose.Types.ObjectId(),
    serviceCode: "S002",
    serviceName: "Bảo trì thang máy",
    serviceType: "Maintenance",
    unitPrice: 2000000,
    description: "Bảo trì định kỳ cho hệ thống thang máy",
  });

  const service3 = new BuildingService({
    _id: new mongoose.Types.ObjectId(),
    serviceCode: "S003",
    serviceName: "Dịch vụ bảo vệ",
    serviceType: "Security",
    unitPrice: 1500000,
    description: "Dịch vụ bảo vệ an ninh 24/7",
  });

  const service4 = new BuildingService({
    _id: new mongoose.Types.ObjectId(),
    serviceCode: "S004",
    serviceName: "Phun khử trùng",
    serviceType: "Sanitization",
    unitPrice: 300000,
    description: "Phun khử trùng các khu vực công cộng trong tòa nhà",
  });

  const service5 = new BuildingService({
    _id: new mongoose.Types.ObjectId(),
    serviceCode: "S005",
    serviceName: "Bảo trì hệ thống điện",
    serviceType: "Maintenance",
    unitPrice: 1000000,
    description: "Bảo trì định kỳ cho hệ thống điện",
  });

  await BuildingService.insertMany([
    service1,
    service2,
    service3,
    service4,
    service5,
  ]);

  // BuildingEmployees
  const buildingEmployee1 = new BuildingEmployee({
    _id: new mongoose.Types.ObjectId(),
    name: "Nguyễn Văn A",
    dob: new Date("1990-01-01"),
    address: "Số 1, Đường A, Quận 1, TP.HCM",
    phone: "0901234567",
    position: "Bảo vệ",
    role: "Nhân viên",
  });

  const buildingEmployee2 = new BuildingEmployee({
    _id: new mongoose.Types.ObjectId(),
    name: "Trần Thị B",
    dob: new Date("1988-02-15"),
    address: "Số 2, Đường B, Quận 2, TP.HCM",
    phone: "0902345678",
    position: "Lễ tân",
    role: "Nhân viên",
  });

  const buildingEmployee3 = new BuildingEmployee({
    _id: new mongoose.Types.ObjectId(),
    name: "Lê Văn C",
    dob: new Date("1995-05-20"),
    address: "Số 3, Đường C, Quận 3, TP.HCM",
    phone: "0903456789",
    position: "Kỹ thuật viên",
    role: "Nhân viên",
  });

  const buildingEmployee4 = new BuildingEmployee({
    _id: new mongoose.Types.ObjectId(),
    name: "Phạm Thị D",
    dob: new Date("1992-11-30"),
    address: "Số 4, Đường D, Quận 4, TP.HCM",
    phone: "0904567890",
    position: "Quản lý",
    role: "Nhân viên",
  });

  const buildingEmployee5 = new BuildingEmployee({
    _id: new mongoose.Types.ObjectId(),
    name: "Đặng Văn E",
    dob: new Date("1991-07-10"),
    address: "Số 5, Đường E, Quận 5, TP.HCM",
    phone: "0905678901",
    position: "Nhân viên bảo trì",
    role: "Nhân viên",
  });

  await BuildingEmployee.insertMany([
    buildingEmployee1,
    buildingEmployee2,
    buildingEmployee3,
    buildingEmployee4,
    buildingEmployee5,
  ]);
  // ServiceRecords
  const record1 = new ServiceRecord({
    _id: new mongoose.Types.ObjectId(),
    serviceId: service1._id,
    companyId: company1._id,
    employeeId: buildingEmployee1._id,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-30"),
    income: 5000000,
  });

  const record2 = new ServiceRecord({
    _id: new mongoose.Types.ObjectId(),
    serviceId: service2._id,
    companyId: company2._id,
    employeeId: buildingEmployee2._id,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-30"),
    income: 10000000,
  });

  const record3 = new ServiceRecord({
    _id: new mongoose.Types.ObjectId(),
    serviceId: service3._id,
    companyId: company3._id,
    employeeId: buildingEmployee3._id,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-30"),
    income: 7500000,
  });

  const record4 = new ServiceRecord({
    _id: new mongoose.Types.ObjectId(),
    serviceId: service4._id,
    companyId: company4._id,
    employeeId: buildingEmployee4._id,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-30"),
    income: 3000000,
  });

  const record5 = new ServiceRecord({
    _id: new mongoose.Types.ObjectId(),
    serviceId: service5._id,
    companyId: company5._id,
    employeeId: buildingEmployee5._id,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-30"),
    income: 6000000,
  });

  await ServiceRecord.insertMany([record1, record2, record3, record4, record5]);
  // SalaryRecords
  const salaryRecord1 = new SalaryRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: buildingEmployee1._id,
    serviceId: service1._id,
    companyId: company1._id,
    month: new Date("2024-10-01"),
    serviceType: "Dịch vụ bảo vệ",
    salaryAmount: 5000000,
  });

  const salaryRecord2 = new SalaryRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: buildingEmployee2._id,
    serviceId: service2._id,
    companyId: company2._id,
    month: new Date("2024-10-01"),
    serviceType: "Dịch vụ lễ tân",
    salaryAmount: 4000000,
  });

  const salaryRecord3 = new SalaryRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: buildingEmployee3._id,
    serviceId: service3._id,
    companyId: company3._id,
    month: new Date("2024-10-01"),
    serviceType: "Dịch vụ bảo trì thiết bị",
    salaryAmount: 6000000,
  });

  const salaryRecord4 = new SalaryRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: buildingEmployee4._id,
    serviceId: service4._id,
    companyId: company4._id,
    month: new Date("2024-10-01"),
    serviceType: "Dịch vụ vệ sinh",
    salaryAmount: 8000000,
  });

  const salaryRecord5 = new SalaryRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: buildingEmployee5._id,
    serviceId: service5._id,
    companyId: company5._id,
    month: new Date("2024-10-01"),
    serviceType: "Dịch vụ trông giữ xe",
    salaryAmount: 4500000,
  });

  await SalaryRecord.insertMany([
    salaryRecord1,
    salaryRecord2,
    salaryRecord3,
    salaryRecord4,
    salaryRecord5,
  ]);

  // AccessRecords
  const accessRecord1 = new AccessRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: employee1._id,
    date: new Date("2024-09-28"),
    time: new Date("2024-09-28T08:30:00Z"), // 8:30 sáng
    location: "Tầng 1",
    action: "vào",
  });

  const accessRecord2 = new AccessRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: employee2._id,
    date: new Date("2024-09-28"),
    time: new Date("2024-09-28T17:15:00Z"), // 5:15 chiều
    location: "Hầm B1",
    action: "ra",
  });

  const accessRecord3 = new AccessRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: employee3._id,
    date: new Date("2024-09-28"),
    time: new Date("2024-09-28T09:00:00Z"), // 9:00 sáng
    location: "Tầng 1",
    action: "vào",
  });

  const accessRecord4 = new AccessRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: employee4._id,
    date: new Date("2024-09-28"),
    time: new Date("2024-09-28T18:00:00Z"), // 6:00 chiều
    location: "Hầm B2",
    action: "ra",
  });

  const accessRecord5 = new AccessRecord({
    _id: new mongoose.Types.ObjectId(),
    employeeId: employee5._id,
    date: new Date("2024-09-28"),
    time: new Date("2024-09-28T12:30:00Z"), // 12:30 trưa
    location: "Tầng 1",
    action: "vào",
  });

  await AccessRecord.insertMany([
    accessRecord1,
    accessRecord2,
    accessRecord3,
    accessRecord4,
    accessRecord5,
  ]);

  console.log("Dữ liệu mẫu đã được thêm vào!");
  mongoose.connection.close();
};

seedData();
