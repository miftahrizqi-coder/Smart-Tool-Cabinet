import React from "react";

function ToolStatusBadge({
  status = "UNKNOWN",
}) {
  const normalized =
    status.toUpperCase();

  const className =
    normalized === "AVAILABLE"
      ? "available"
      : normalized === "BORROWED"
        ? "in-use"
        : normalized === "MAINTENANCE"
          ? "maintenance"
          : "unknown";

  const label =
    normalized === "IN_USE"
      ? "IN USE"
      : normalized;

  return (
    <span
      className={`stc-tool-status-badge stc-tool-status-badge--${className}`}
    >
      <span className="stc-tool-status-badge__dot" />
      {label}
    </span>
  );
}

export default ToolStatusBadge;