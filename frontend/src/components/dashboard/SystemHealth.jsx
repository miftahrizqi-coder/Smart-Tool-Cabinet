import React from "react";
import {
  Radio,
  Database,
  Server,
  Cpu,
} from "lucide-react";

import Card from "../ui/Card";

const HEALTH_ITEMS = [
  {
    icon: Radio,
    label: "MQTT Broker",
    value: "ONLINE",
  },
  {
    icon: Database,
    label: "Firestore",
    value: "ONLINE",
  },
  {
    icon: Server,
    label: "FastAPI Backend",
    value: "ONLINE",
  },
  {
    icon: Cpu,
    label: "ESP32 Cabinets",
    value: "10 / 12 ONLINE",
  },
];

function SystemHealth() {
  return (
    <Card
      className="stc-system-health"
      padding="default"
    >
      <div className="stc-panel-header stc-panel-header--plain">
        <h2 className="stc-panel-title">
          System Health
        </h2>
      </div>

      <div className="stc-health-list">
        {HEALTH_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="stc-health-row"
            >
              <div className="stc-health-row__label">
                <Icon
                  size={14}
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </div>

              <div className="stc-health-row__value">
                <span className="stc-health-dot" />
                <span className="mono">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stc-health-metrics">
        <div>
          <span>MQTT Messages</span>
          <strong className="mono">
            1,284 today
          </strong>
        </div>

        <div>
          <span>Last synchronization</span>
          <strong className="mono">
            2 seconds ago
          </strong>
        </div>
      </div>
    </Card>
  );
}

export default SystemHealth;