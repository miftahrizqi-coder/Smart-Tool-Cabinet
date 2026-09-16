import React from "react";
import {
  Activity,
  Wrench,
  TrendingUp,
} from "lucide-react";

function ToolUsageSummary({
  tool,
}) {
  const usagePercentage =
    Math.min(
      100,
      Math.round(
        (tool.usageCount /
          tool.maintenanceThreshold) *
          100
      )
    );

  return (
    <div className="stc-tool-usage-summary">
      <div className="stc-tool-usage-summary__header">
        <div>
          <div className="stc-tool-usage-summary__title">
            Usage & Maintenance
          </div>

          <div className="stc-tool-usage-summary__description">
            Usage progress toward the maintenance
            threshold.
          </div>
        </div>

        <Activity size={16} />
      </div>

      <div className="stc-tool-usage-summary__metrics">
        <div>
          <Wrench size={14} />

          <span>
            Current Usage
          </span>

          <strong className="mono">
            {tool.usageCount}
          </strong>
        </div>

        <div>
          <TrendingUp size={14} />

          <span>
            Threshold
          </span>

          <strong className="mono">
            {tool.maintenanceThreshold}
          </strong>
        </div>
      </div>

      <div className="stc-tool-usage-summary__bar">
        <div
          style={{
            width: `${usagePercentage}%`,
          }}
        />
      </div>

      <div className="stc-tool-usage-summary__percentage mono">
        {usagePercentage}% of maintenance threshold
      </div>
    </div>
  );
}

export default ToolUsageSummary;