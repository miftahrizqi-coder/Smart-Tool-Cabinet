import Badge from "../ui/Badge.jsx";

const STATUS_CONFIG = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

function EmployeeStatusBadge({ status }) {
  const normalizedStatus = String(status || "").toUpperCase();

  const badgeStatus =
    STATUS_CONFIG[normalizedStatus] || "unknown";

  return (
    <Badge status={badgeStatus}>
      {normalizedStatus || "UNKNOWN"}
    </Badge>
  );
}

export default EmployeeStatusBadge;