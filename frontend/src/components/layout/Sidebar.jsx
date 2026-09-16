import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Box,
  Wrench,
  Users,
  ArrowLeftRight,
  Activity,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Cabinets",
    path: "/cabinets",
    icon: Box,
  },
  {
    label: "Tools",
    path: "/tools",
    icon: Wrench,
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Maintenance",
    path: "/maintenance",
    icon: Activity,
  },
  {
    label: "Events",
    path: "/events",
    icon: Activity,
  },
];

function Sidebar() {
  return (
    <aside className="stc-sidebar">
      <div className="stc-sidebar__brand">
        <div className="stc-sidebar__logo">
          <ShieldCheck size={18} />
        </div>

        <div className="stc-sidebar__brand-text">
          <div className="stc-sidebar__title">
            Smart Tool
          </div>

          <div className="stc-sidebar__subtitle">
            Cabinet
          </div>
        </div>
      </div>

      <nav className="stc-sidebar__nav">
        <div className="stc-sidebar__section-label">
          Workspace
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "stc-sidebar__link",
                  isActive ? "stc-sidebar__link--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <Icon
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="stc-sidebar__bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              "stc-sidebar__link",
              isActive ? "stc-sidebar__link--active" : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          <Settings
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>Settings</span>
        </NavLink>

        <div className="stc-sidebar__system">
          <span className="stc-sidebar__system-dot" />

          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;