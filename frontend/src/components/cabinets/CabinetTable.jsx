import React from "react";
import { ChevronRight } from "lucide-react";

import CabinetStatusBadge from "./CabinetStatusBadge";

function CabinetTable({
  cabinets = [],
  toolCounts = {},
  onOpen,
}) {
  return (
    <div className="stc-cabinet-table-wrapper">
      <table className="stc-cabinet-table">
        <thead>
          <tr>
            <th>Cabinet</th>
            <th>Location</th>
            <th>Status</th>
            <th>Door</th>
            <th>Tools</th>
            <th>Active TX</th>
            <th>Last Activity</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {cabinets.map((cabinet) => {
            const cabinetId = cabinet.cabinetId;
            const status = cabinet.status?.toUpperCase();

            return (
              <tr
                key={cabinetId}
                onClick={() => onOpen?.(cabinetId)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    onOpen?.(cabinetId);
                  }
                }}
              >
                <td>
                  <div className="stc-cabinet-table__name">
                    {cabinet.name || "—"}
                  </div>

                  <div className="stc-cabinet-table__id mono">
                    {cabinetId}
                  </div>
                </td>

                <td>
                  {cabinet.location || "—"}
                </td>

                <td>
                  <CabinetStatusBadge
                    status={status}
                  />
                </td>

                <td className="mono">
                  —
                </td>

                <td className="mono">
                  {toolCounts[cabinetId] ?? 0} /{" "}
                  {cabinet.slotCount ?? 0}
                </td>

                <td className="mono">
                  —
                </td>

                <td className="mono">
                  —
                </td>

                <td>
                  <ChevronRight
                    size={14}
                    aria-hidden="true"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CabinetTable;