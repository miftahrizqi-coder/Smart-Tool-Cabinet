import Badge from "../ui/Badge.jsx";

function TransactionStatusBadge({
  status = "unknown",
}) {
  const normalizedStatus =
    String(status || "unknown").toLowerCase();

  const badgeStatus =
    normalizedStatus === "open"
      ? "OPEN"
      : normalizedStatus;

  return (
    <Badge status={badgeStatus} />
  );
}

export default TransactionStatusBadge;