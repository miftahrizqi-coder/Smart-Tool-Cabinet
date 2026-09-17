import React from "react";

const STATUS_CONFIG = {
  online: {
    label: "ONLINE",
    color: "success",
  },

  available: {
    label: "AVAILABLE",
    color: "success",
  },

  success: {
    label: "SUCCESS",
    color: "success",
  },

  completed: {
    label: "COMPLETED",
    color: "success",
  },

  offline: {
    label: "OFFLINE",
    color: "danger",
  },

  critical: {
    label: "CRITICAL",
    color: "danger",
  },

  failed: {
    label: "FAILED",
    color: "danger",
  },

  warning: {
    label: "WARNING",
    color: "warning",
  },

  maintenance: {
    label: "MAINTENANCE",
    color: "warning",
  },

  information: {
    label: "INFORMATION",
    color: "info",
  },

  info: {
    label: "INFO",
    color: "info",
  },

  borrowed: {
    label: "BORROWED",
    color: "warning",
  },

  active: {
    label: "ACTIVE",
    color: "info",
  },

  open: {
    label: "OPEN",
    color: "info",
  },

  inactive: {
    label: "INACTIVE",
    color: "neutral",
  },

  unknown: {
    label: "UNKNOWN",
    color: "neutral",
  },
  pending: {
    label: "PENDING",
    color: "warning",
  },

  in_progress: {
    label: "IN PROGRESS",
    color: "info",
  },

  low: {
  label: "LOW",
  color: "neutral",
  },

  medium: {
    label: "MEDIUM",
    color: "info",
  },

  high: {
    label: "HIGH",
    color: "warning",
  },
};

function Badge({
  status,
  children,
  dot = true,
  className = "",
}) {
  const normalizedStatus = String(status || "").toLowerCase();

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: status,
    color: "neutral",
  };

  const label = children ?? config.label;

  return (
    <span
      className={`stc-badge stc-badge--${config.color} ${className}`}
    >
      {dot && <span className="stc-badge__dot" />}
      <span>{label}</span>
    </span>
  );
}

export default Badge;