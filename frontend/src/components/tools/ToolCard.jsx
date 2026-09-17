import React from "react";
import {
  ChevronRight,
  Package,
  MapPin,
  Activity,
} from "lucide-react";

import Card from "../ui/Card";
import ToolStatusBadge from "./ToolStatusBadge";

function ToolCard({
  tool,
  onOpen,
}) {
  return (
    <Card
      className="stc-tool-card"
      padding="default"
    >
      <button
        type="button"
        className="stc-tool-card__button"
        onClick={() =>
          onOpen?.(tool.id)
        }
      >
        <div className="stc-tool-card__header">
          <div>
            <div className="stc-tool-card__name">
              {tool.name}
            </div>

            <div className="stc-tool-card__asset mono">
              {tool.assetNumber}
            </div>
          </div>

          <ChevronRight
            size={15}
            aria-hidden="true"
          />
        </div>

        <ToolStatusBadge
          status={tool.status}
        />

        <div className="stc-tool-card__info">
          <div>
            <Package size={13} />

            <span>
              {tool.category}
            </span>
          </div>

          <div>
            <MapPin size={13} />

            <span className="mono">
              {tool.cabinetId || "-"} / Slot{" "}
              {String(
                tool.slotNumber
              ).padStart(2, "0")}
            </span>
          </div>

          <div>
            <Activity size={13} />

            <span className="mono">
              {tool.usageCount} uses
            </span>
          </div>
        </div>

        <div className="stc-tool-card__footer">
          <span>
            Last used
          </span>

          <span className="mono">
            {tool.lastUsage}
          </span>
        </div>
      </button>
    </Card>
  );
}

export default ToolCard;