import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from "@mui/material"; // Import TextField và Button
import api from "../services/api";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [limit, setLimit] = useState(10); // Thêm state cho limit

  // Hàm gọi API để lấy danh sách công ty
  const fetchCompanies = () => {
    api
      .get(`/api/companies/monthly-costs?limit=${limit}`) // Sửa lại đường dẫn API
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));
  };

  useEffect(() => {
    fetchCompanies(); // Gọi API khi component được render lần đầu
  }, [limit]); // Cập nhật để gọi lại khi limit thay đổi

  return (
    <div>
      <h2>Danh sách công ty và tổng chi phí phải trả</h2>

      {/* Phần input cho giới hạn số lượng bản ghi và nút tìm kiếm */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Giới hạn số lượng bản ghi"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))} // Cập nhật giá trị limit
          style={{ marginRight: "10px" }} // Căn lề cho đẹp
        />
        <Button variant="contained" color="primary" onClick={fetchCompanies}>
          Tìm kiếm
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên công ty</TableCell>
            <TableCell>Diện tích thuê (m²)</TableCell>
            <TableCell>Tổng chi phí theo tháng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <React.Fragment key={company._id}>
              <TableRow>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.area}</TableCell>
                <TableCell>
                  {/* Hiển thị bảng chi phí theo tháng */}
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tháng/Năm</TableCell>
                        <TableCell>Chi phí diện tích (VND)</TableCell>
                        <TableCell>Chi phí dịch vụ (VND)</TableCell>
                        <TableCell>Tổng chi phí (VND)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {company.totalBillByMonth.map((monthCost, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${monthCost.month}/${monthCost.year}`}</TableCell>
                          <TableCell>
                            {monthCost.totalAreaCost.toLocaleString()} VND
                          </TableCell>
                          <TableCell>
                            {monthCost.totalServiceCost.toLocaleString()} VND
                          </TableCell>
                          <TableCell>
                            {monthCost.totalCost.toLocaleString()} VND
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyList;
