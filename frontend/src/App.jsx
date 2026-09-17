import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Cabinets from "./pages/Cabinets";
import CabinetDetail from "./pages/CabinetDetail";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Employees from "./pages/Employees.jsx";
import EmployeeDetail from "./pages/EmployeeDetail.jsx";
import Transactions from "./pages/Transactions.jsx";
import TransactionDetail from "./pages/TransactionDetail.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import MaintenanceDetail from "./pages/MaintenanceDetail.jsx";
import ApiTest from "./pages/ApiTest.jsx";
import FirestoreTest from "./pages/FirestoreTest.jsx";
import Events from "./pages/Events.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        <Route
          path="/firestoreTest"
          element={<FirestoreTest />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        
        {/* Page Cabinets */}
        <Route
          path="/cabinets"
          element={<Cabinets />}
        />

        <Route
          path="/cabinets/:cabinetId"
          element={<CabinetDetail />}
        />

        {/* Page Tools */}
        <Route
          path="/tools"
          element={<Tools />}
        />

        <Route
          path="/tools/:toolId"
          element={<ToolDetail />}
        />

        {/* Page Employees */}
         <Route
            path="/employees"
            element={<Employees />}
          />

          <Route
            path="/employees/:employeeId"
            element={<EmployeeDetail />}
          />

        {/* Page Transactions */}
        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/transactions/:transactionId"
          element={<TransactionDetail />}
        />
        <Route
          path="/maintenance"
          element={<Maintenance />}
        />

        <Route
          path="/maintenance/:maintenanceId"
          element={<MaintenanceDetail />}
        />

        <Route
          path="/events"
          element={<Events/>}
        />

        <Route path="/api-test" element={<ApiTest />} />
      </Route>
      
      {/* Redirect default */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;