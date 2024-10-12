import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from "@mui/material";
import api from "../services/api"; // Sử dụng axios từ file api.js

const BuildingEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Mặc định là tháng hiện tại
  const [year, setYear] = useState(new Date().getFullYear()); // Mặc định là năm hiện tại
  const [limit, setLimit] = useState(10); // Mặc định là 10 bản ghi
  const [error, setError] = useState(null); // Lưu thông báo lỗi

  // Hàm gọi API với các tham số month, year, limit
  const fetchEmployees = () => {
    if (month < 1 || month > 12) {
      setError("Tháng phải nằm trong khoảng từ 1 đến 12.");
      return;
    }
    if (year < 2000) {
      setError("Năm không hợp lệ.");
      return;
    }
    if (limit < 1) {
      setError("Giới hạn phải lớn hơn 0.");
      return;
    }
    setError(null); // Reset lỗi nếu không có vấn đề gì

    api
      .get(`/api/employees/salaries?month=${month}&year=${year}&limit=${limit}`)
      .then((response) => setEmployees(response.data))
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setError("Không thể lấy danh sách nhân viên.");
      });
  };

  useEffect(() => {
    fetchEmployees(); // Gọi API lần đầu khi component mount
  }, []);

  return (
    <div>
      <h2>Danh sách nhân viên tòa nhà</h2>

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Bộ lọc tháng, năm và giới hạn */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Tháng"
          type="number"
          value={month}
          onChange={(e) => setMonth(Math.max(1, Math.min(12, e.target.value)))}
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Năm"
          type="number"
          value={year}
          onChange={(e) => setYear(Math.max(2000, e.target.value))}
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Giới hạn số lượng bản ghi"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Math.max(1, e.target.value))}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={fetchEmployees}>
          Tìm kiếm
        </Button>
      </div>

      {/* Bảng hiển thị danh sách nhân viên */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên nhân viên</TableCell>
            <TableCell>Chức vụ</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Tên công ty</TableCell>
            <TableCell>Lương tháng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.companyName || "Chưa có công ty"}</TableCell>
              <TableCell>
                {employee.monthlySalary
                  ? employee.monthlySalary.toLocaleString() + " VND"
                  : "Chưa có lương"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BuildingEmployeeList;
