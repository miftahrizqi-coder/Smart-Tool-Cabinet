import React from "react";
import { Lock } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

function CabinetVisualization({
  cabinetId = "CAB-DF11099F",
  slots = [],
  doorState = "CLOSED",
  cabinetStatus = "ONLINE",
}) {
  const doors = [
    slots.slice(0, 3),
    slots.slice(3, 6),
  ];

  return (
    <Card
      className="stc-dashboard-panel"
      padding="default"
    >
      <div className="stc-panel-header stc-panel-header--plain">
        <h2 className="stc-panel-title">
          Smart Cabinet Visualization
        </h2>
      </div>

      <div className="stc-cabinet-visual-meta">
        <span className="mono">
          {cabinetId}
        </span>

        <Badge
          status={
            cabinetStatus?.toLowerCase() ||
            "unknown"
          }
        />

        <span>
          <Lock
            size={12}
            aria-hidden="true"
          />

          Door: {doorState}
        </span>
      </div>

      <div className="stc-cabinet-visual">
        {doors.map(
          (doorSlots, doorIndex) => (
            <div
              key={doorIndex}
              className="stc-cabinet-door"
            >
              <div className="stc-cabinet-door__label mono">
                DOOR{" "}
                {doorIndex === 0
                  ? "A"
                  : "B"}
              </div>

              <div className="stc-cabinet-slots">
                {doorSlots.map((slot) => {
                  const toolStatus =
                    slot.status?.toLowerCase();

                  const occupied =
                    toolStatus === "available";

                  const toolName =
                    slot.toolName || "Unknown Tool";

                  const assetNumber =
                    slot.assetNumber;

                  return (
                    <div
                      key={slot.slotNumber}
                      className={`stc-cabinet-slot ${
                        occupied
                          ? "stc-cabinet-slot--occupied"
                          : "stc-cabinet-slot--empty"
                      }`}
                    >
                      <div>
                        <div className="stc-cabinet-slot__number mono">
                          SLOT {slot.slotNumber}
                        </div>

                        <div className="stc-cabinet-slot__tool">
                          {occupied
                            ? toolName
                            : "Empty"}
                        </div>

                        {occupied &&
                          assetNumber && (
                            <div className="stc-cabinet-slot__asset mono">
                              {assetNumber}
                            </div>
                          )}
                      </div>

                      <span className="stc-cabinet-slot__status">
                        {occupied
                          ? "OCCUPIED"
                          : "BORROWED"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}

export default CabinetVisualization;