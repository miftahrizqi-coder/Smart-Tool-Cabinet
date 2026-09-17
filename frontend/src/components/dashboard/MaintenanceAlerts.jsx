import React from "react";
import { Wrench } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

const severityStatus = {
  Critical: "critical",
  Warning: "warning",
  Info: "information",
};

function MaintenanceAlerts({
  alerts = [],
  onViewTool,
  onViewAll,
}) {
  return (
    <Card
      className="stc-dashboard-panel"
      padding="none"
    >
      <div className="stc-panel-header">
        <h2 className="stc-panel-title">
          Maintenance Alerts
        </h2>

        <button
          type="button"
          className="stc-panel-action"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      <div className="stc-maintenance-list">
        {alerts.map((alert) => {
          const percentage =
            alert.threshold > 0
              ? Math.min(
                  (alert.usage / alert.threshold) *
                    100,
                  100
                )
              : 0;

          return (
            <div
              key={alert.tool}
              className="stc-maintenance-row"
            >
              <div className="stc-maintenance-row__icon">
                <Wrench
                  size={15}
                  aria-hidden="true"
                />
              </div>

              <div className="stc-maintenance-row__content">
                <div className="stc-maintenance-row__top">
                  <div>
                    <div className="stc-maintenance-row__tool">
                      {alert.tool}
                    </div>

                    <div className="stc-maintenance-row__description">
                      {alert.desc}
                    </div>
                  </div>

                  <span
                    className={`stc-severity stc-severity--${severityStatus[alert.severity]}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="stc-maintenance-progress">
                  <div
                    className="stc-maintenance-progress__bar"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="stc-maintenance-row__footer">
                  <span className="mono">
                    {alert.usage} / {alert.threshold}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onViewTool?.(alert.tool)
                    }
                  >
                    View Tool
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default MaintenanceAlerts;