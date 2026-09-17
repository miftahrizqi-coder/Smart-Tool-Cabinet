import React from "react";

import Card from "../ui/Card";

function SummaryCard({
  icon: Icon,
  label,
  value,
  subtitle,
}) {
  return (
    <Card
      className="stc-summary-card"
      padding="sm"
    >
      <div className="stc-summary-card__header">
        <span className="stc-summary-card__label">
          {label}
        </span>

        {Icon && (
          <Icon
            size={15}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="stc-summary-card__value">
        {value}
      </div>

      <div className="stc-summary-card__subtitle">
        {subtitle}
      </div>
    </Card>
  );
}

export default SummaryCard;