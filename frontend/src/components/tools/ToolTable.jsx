import React from "react";
import { ChevronRight } from "lucide-react";

import ToolStatusBadge from "./ToolStatusBadge";

function ToolTable({
  tools = [],
  onOpen,
}) {
  return (
    <div className="stc-tool-table-wrapper">
      <table className="stc-tool-table">
        <thead>
          <tr>
            <th>Tool</th>
            <th>Category</th>
            <th>Cabinet</th>
            <th>Slot</th>
            <th>Status</th>
            <th>Usage</th>
            <th>Last Used</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {tools.map((tool) => (
            <tr
              key={tool.id}
              tabIndex={0}
              onClick={() =>
                onOpen?.(tool.id)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  onOpen?.(tool.id);
                }
              }}
            >
              <td>
                <div className="stc-tool-table__name">
                  {tool.name}
                </div>

                <div className="stc-tool-table__id mono">
                  {tool.assetNumber}
                </div>
              </td>

              <td>
                {tool.category}
              </td>

              <td>
                <span className="mono">
                  {tool.cabinetId || "-"}
                </span>
              </td>

              <td className="mono">
                {String(tool.slotNumber).padStart(
                  2,
                  "0"
                )}
              </td>

              <td>
                <ToolStatusBadge
                  status={tool.status}
                />
              </td>

              <td className="mono">
                {tool.usageCount ?? 0}
              </td>

              <td className="mono">
                {tool.lastUsage}
              </td>

              <td>
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ToolTable;