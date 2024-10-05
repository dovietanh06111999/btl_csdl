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
      .get(`/api/companies/monthly-costs?limit=${limit}`)
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));
  };

  useEffect(() => {
    fetchCompanies(); // Gọi API khi component được render lần đầu
  }, []);

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
            <TableCell>Tiền thuê mặt bằng (VNĐ)</TableCell>
            <TableCell>Tổng tiền dịch vụ (VNĐ)</TableCell>
            <TableCell>Tổng chi phí hàng tháng (VNĐ)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company._id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.area}</TableCell>
              <TableCell>{company.areaCost.toLocaleString()} VND</TableCell>
              <TableCell>
                {company.totalServiceCost.toLocaleString()} VND
              </TableCell>
              <TableCell>{company.totalCost.toLocaleString()} VND</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyList;
