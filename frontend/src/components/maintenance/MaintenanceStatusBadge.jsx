import Badge from "../ui/Badge.jsx";

function MaintenanceStatusBadge({ status }) {
  const normalizedStatus = String(
    status || "unknown"
  ).toLowerCase();

  return (
    <Badge status={normalizedStatus} />
  );
}

export default MaintenanceStatusBadge;