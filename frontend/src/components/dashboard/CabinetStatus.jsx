import React from "react";
import { ChevronRight } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

function CabinetStatus({
  cabinets = [],
  onOpenCabinet,
  onViewAll,
}) {
  return (
    <Card
      className="stc-dashboard-panel"
      padding="none"
    >
      <div className="stc-panel-header">
        <h2 className="stc-panel-title">
          Cabinet Status
        </h2>

        <button
          type="button"
          className="stc-panel-action"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      <div className="stc-cabinet-list">
        {cabinets.map((cabinet) => {
          const cabinetId =
            cabinet.cabinetId || cabinet.id;

          return (
            <button
              key={cabinetId}
              type="button"
              className="stc-cabinet-row"
              onClick={() =>
                onOpenCabinet?.(cabinetId)
              }
            >
              <span className="stc-cabinet-row__id mono">
                {cabinetId}
              </span>

              <span className="stc-cabinet-row__location">
                {cabinet.location || "—"}
              </span>

              <span className="stc-cabinet-row__status">
                <Badge
                  status={
                    cabinet.status?.toLowerCase() ||
                    "unknown"
                  }
                />
              </span>

              <span className="stc-cabinet-row__door">
                Door {cabinet.door ?? "—"}
              </span>

              <span className="stc-cabinet-row__tools mono">
                {cabinet.tools ?? "—"}
              </span>

              <span className="stc-cabinet-row__activity">
                {cabinet.lastActivity || "—"}
              </span>

              <ChevronRight
                size={14}
                className="stc-cabinet-row__arrow"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default CabinetStatus;