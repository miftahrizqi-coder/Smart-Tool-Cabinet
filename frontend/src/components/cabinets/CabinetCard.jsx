
import React from "react";
import {
  MapPin,
  DoorOpen,
  Package,
  ChevronRight,
} from "lucide-react";

import Card from "../ui/Card";
import CabinetStatusBadge from "./CabinetStatusBadge";

function CabinetCard({
  cabinet,
  toolCount = 0,
  onOpen,
}) {
  const cabinetId = cabinet.cabinetId;

  const status = cabinet.status?.toUpperCase();

  return (
    <Card
      className="stc-cabinet-card"
      padding="default"
    >
      <button
        type="button"
        className="stc-cabinet-card__button"
        onClick={() => onOpen?.(cabinetId)}
      >
        <div className="stc-cabinet-card__header">
          <div>
            <div className="stc-cabinet-card__label mono">
              {cabinet.name || "—"}
            </div>

            <div className="stc-cabinet-card__id mono">
              {cabinetId}
            </div>
          </div>

          <ChevronRight
            size={15}
            aria-hidden="true"
          />
        </div>

        <CabinetStatusBadge
          status={status}
        />

        <div className="stc-cabinet-card__location">
          <MapPin size={13} />
          {cabinet.location || "—"}
        </div>

        <div className="stc-cabinet-card__stats">
          <div>
            <Package size={13} />

            <span>
              {toolCount} / {cabinet.slotCount ?? 0} tools
            </span>
          </div>

          <div>
            <DoorOpen size={13} />

            <span>
              Door —
            </span>
          </div>
        </div>

        <div className="stc-cabinet-card__footer">
          <span>Last activity</span>

          <span className="mono">
            —
          </span>
        </div>
      </button>
    </Card>
  );
}

export default CabinetCard;