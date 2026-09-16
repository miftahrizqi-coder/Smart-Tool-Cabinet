import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import PageContainer from "./PageContainer";

const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/cabinets": "Cabinets",
  "/tools": "Tools",
  "/employees": "Employees",
  "/transactions": "Transactions",
  "/maintenance": "Maintenance",
  "/events": "Events",
  "/settings": "Settings",
  "/status": "System Status",
};

function AppLayout() {
  const location = useLocation();

  const title =
    PAGE_TITLES[location.pathname] || "Smart Tool Cabinet";

  const PAGE_META = {
    "/dashboard": {
      title: "Dashboard",
      description:
        "Monitor your smart tool cabinet system.",
    },

    "/cabinets": {
      title: "Cabinets",
      description:
        "Monitor cabinet connectivity and door state.",
    },

    "/tools": {
      title: "Tools",
      description:
        "Track tool availability, usage and maintenance.",
    },

    "/employees": {
      title: "Employees",
      description:
        "Manage employees and RFID access.",
    },

    "/transactions": {
      title: "Transactions",
      description:
        "Monitor tool borrowing and return activity.",
    },

    "/maintenance": {
      title: "Maintenance",
      description:
        "Review alerts and maintenance thresholds.",
    },

    "/events": {
      title: "Events",
      description:
        "Live activity from the ESP32 and MQTT backend.",
    },

    "/settings": {
      title: "Settings",
      description:
        "Configure system preferences.",
    },

    "/status": {
      title: "System Status",
      description:
        "Backend and cabinet connectivity health.",
    },
  };

  const meta =
  PAGE_META[location.pathname] ||
  PAGE_META["/dashboard"];

  return (
    <div className="stc-app">
      <Sidebar />

      <div className="stc-app__content">
        <Header title={meta.title} 
          description={meta.description}
        />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}

export default AppLayout;