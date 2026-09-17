
import TransactionStatusBadge from "./TransactionStatusBadge.jsx";

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function TransactionCard({
  transaction,
  onOpen,
}) {
  const transactionId =
    transaction.transactionId;

  const status =
    transaction.status?.toUpperCase();

  return (
    <button
      type="button"
      className="transaction-card"
      onClick={() => onOpen(transactionId)}
    >
      <div className="transaction-card-header">
        <div>
          <div className="transaction-card-id">
            {transactionId}
          </div>

          <div className="transaction-card-employee">
            {transaction.employeeId || "—"}
          </div>
        </div>

        <TransactionStatusBadge
          status={status}
        />
      </div>

      <div className="transaction-card-info">
        <div>
          <span>Cabinet</span>
          <strong>
            {transaction.cabinetId || "—"}
          </strong>
        </div>

        <div>
          <span>Tools</span>
          <strong>—</strong>
        </div>

        <div>
          <span>Started</span>
          <strong>
            {formatDateTime(
              transaction.startedAt
            )}
          </strong>
        </div>

        <div>
          <span>Ended</span>
          <strong>
            {formatDateTime(
              transaction.completedAt
            )}
          </strong>
        </div>
      </div>
    </button>
  );
}

export default TransactionCard;