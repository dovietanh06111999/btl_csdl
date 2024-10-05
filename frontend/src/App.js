import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CompanyList from "./components/CompanyList";
import EmployeeCheck from "./components/EmployeeCheck";
import BuildingEmployeeList from "./components/BuildingEmployeeList";
import { Button, Stack } from "@mui/material"; // Import Button và Stack từ Material-UI

function App() {
  return (
    <Router>
      <div>
        <nav>
          {/* Sử dụng Stack để bố trí các nút bấm theo chiều ngang */}
          <Stack direction="row" spacing={2} style={{ marginBottom: "20px" }}>
            {/* Các nút bấm sử dụng component Button */}
            <Button
              component={Link}
              to="/companies"
              variant="contained"
              color="primary"
            >
              Danh sách công ty
            </Button>
            <Button
              component={Link}
              to="/employees-check"
              variant="contained"
              color="primary"
            >
              Thông tin ra/vào của nhân viên
            </Button>
            <Button
              component={Link}
              to="/building-employees"
              variant="contained"
              color="primary"
            >
              Nhân viên tòa nhà
            </Button>
          </Stack>
        </nav>
        <Routes>
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/employees-check" element={<EmployeeCheck />} />
          <Route
            path="/building-employees"
            element={<BuildingEmployeeList />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
