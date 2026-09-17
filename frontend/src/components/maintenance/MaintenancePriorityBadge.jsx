import Badge from "../ui/Badge.jsx";

const priorityConfig = {
  LOW: {
    status: "low",
    label: "LOW",
  },

  MEDIUM: {
    status: "medium",
    label: "MEDIUM",
  },

  HIGH: {
    status: "high",
    label: "HIGH",
  },

  CRITICAL: {
    status: "critical",
    label: "CRITICAL",
  },
};

function MaintenancePriorityBadge({ priority }) {
  const config =
    priorityConfig[priority] ||
    priorityConfig.MEDIUM;

  return (
    <Badge status={config.status}>
      {config.label}
    </Badge>
  );
}

export default MaintenancePriorityBadge;