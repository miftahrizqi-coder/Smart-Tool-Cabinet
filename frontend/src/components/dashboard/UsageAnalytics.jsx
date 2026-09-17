import React from "react";

import Card from "../ui/Card";

function UsageAnalytics({
  data = [],
}) {
  const max =
    data.length > 0
      ? Math.max(...data.map((item) => item.count))
      : 0;

  return (
    <Card
      className="stc-usage-card"
      padding="default"
    >
      <div className="stc-panel-header stc-panel-header--plain">
        <div>
          <h2 className="stc-panel-title">
            Tool Usage
          </h2>

          <div className="stc-panel-subtitle">
            Last 7 days
          </div>
        </div>
      </div>

      <div className="stc-usage-chart">
        {data.map((item) => {
          const height =
            max > 0
              ? Math.max(
                  (item.count / max) * 100,
                  6
                )
              : 0;

          return (
            <div
              key={item.day}
              className="stc-usage-column"
            >
              <div className="stc-usage-count mono">
                {item.count}
              </div>

              <div className="stc-usage-bar-wrapper">
                <div
                  className="stc-usage-bar"
                  style={{
                    height: `${height}%`,
                  }}
                />
              </div>

              <div className="stc-usage-day">
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default UsageAnalytics;