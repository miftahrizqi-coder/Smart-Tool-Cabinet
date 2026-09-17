import React from "react";
import { ChevronRight } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

function ToolStatus({
  tools = [],
  onOpenTool,
  onViewAll,
}) {
  return (
    <Card
      className="stc-dashboard-panel"
      padding="none"
    >
      <div className="stc-panel-header">
        <h2 className="stc-panel-title">
          Tool Status
        </h2>

        <button
          type="button"
          className="stc-panel-action"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      <div className="stc-tool-list stc-tool-list--scrollable">
        {tools.map((tool) => {
          const toolId =
            tool.toolId || tool.id;

          const assetNumber =
            tool.assetNumber || "—";

          const usageCount =
            tool.usageCount ?? 0;

          return (
            <button
              key={toolId}
              type="button"
              className="stc-tool-row"
              onClick={() =>
                onOpenTool?.(toolId)
              }
            >
              <div className="stc-tool-row__main">
                <span className="stc-tool-row__name">
                  {tool.name || "Unnamed Tool"}
                </span>

                <span className="stc-tool-row__meta mono">
                  {assetNumber}
                </span>
              </div>

              <Badge
                status={
                  tool.status?.toLowerCase() ||
                  "unknown"
                }
              />

              <span className="stc-tool-row__usage mono">
                {usageCount} uses
              </span>

              <ChevronRight
                size={14}
                className="stc-tool-row__arrow"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default ToolStatus;