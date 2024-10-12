import React, { useEffect, useState } from "react";
import axios from "../services/api"; // sử dụng axios từ file api.js
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../services/api";

const EmployeeCheck = () => {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(""); // State để lưu trữ ngày được chọn
  const [limit, setLimit] = useState(5); // State để lưu trữ giới hạn số lượng bản ghi

  // Hàm gọi API để lấy thông tin truy cập dựa trên ngày và giới hạn
  const fetchEmployeeAccessInfo = (selectedDate, recordLimit) => {
    const query = selectedDate
      ? `?date=${selectedDate}&limit=${recordLimit}`
      : `?limit=${recordLimit}`;
    api
      .get(`/api/employees/access-info${query}`)
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  };

  // useEffect sẽ được gọi ngay khi component load lần đầu tiên
  useEffect(() => {
    fetchEmployeeAccessInfo(); // Mặc định lấy thông tin cho ngày hiện tại mà không có giới hạn
  }, []);

  // Hàm xử lý sự kiện khi bấm nút "Tìm kiếm"
  const handleSearch = () => {
    const recordLimit = parseInt(limit, 10); // Chuyển đổi limit thành số nguyên
    if (isNaN(recordLimit) || recordLimit < 0) {
      alert("Giới hạn số lượng bản ghi phải là số nguyên không âm."); // Thông báo lỗi nếu không hợp lệ
      return;
    }
    fetchEmployeeAccessInfo(date, recordLimit); // Gọi API với ngày được chọn và giới hạn
  };

  return (
    <div>
      <h2>Thông tin ra/vào của nhân viên</h2>

      {/* Thêm phần chọn ngày và nút tìm kiếm */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Chọn ngày"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Giới hạn số lượng bản ghi"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          style={{ marginLeft: "10px", marginRight: "10px" }} // Thêm margin cho đẹp
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      {/* Hiển thị bảng thông tin nhân viên */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên nhân viên</TableCell>
            <TableCell>Công ty</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Số lần ra/vào</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <React.Fragment key={employee._id}>
              <TableRow>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.companyName}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.accessCount}</TableCell>
              </TableRow>
              {/* Hiển thị chi tiết các lần ra vào nếu có */}
              {employee.accessRecords.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Chi tiết các lần ra/vào</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Ngày</TableCell>
                              <TableCell>Thời gian</TableCell>
                              <TableCell>Vị trí</TableCell>
                              <TableCell>Hành động</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {employee.accessRecords.map((record) => (
                              <TableRow key={record._id}>
                                <TableCell>
                                  {new Date(record.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(record.time).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>{record.location}</TableCell>
                                <TableCell>
                                  {record.action === "ra" ? "Ra" : "Vào"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeCheck;
