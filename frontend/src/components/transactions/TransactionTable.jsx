import TransactionStatusBadge from "./TransactionStatusBadge.jsx";

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  let date;

  if (value?.toDate) {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function TransactionTable({
  transactions,
  onOpenTransaction,
}) {
  return (
    <div className="transaction-table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Employee</th>
            <th>Cabinet</th>
            <th>Tools</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const transactionId =
              transaction.transactionId;

            const status =
              transaction.status?.toUpperCase();

            return (
              <tr
                key={transactionId}
                className="transaction-row"
                onClick={() =>
                  onOpenTransaction(transactionId)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();

                    onOpenTransaction(
                      transactionId
                    );
                  }
                }}
                tabIndex={0}
              >
                <td className="transaction-id">
                  {transactionId}
                </td>

                <td>
                  {transaction.employeeId || "—"}
                </td>

                <td className="transaction-cabinet">
                  {transaction.cabinetId || "—"}
                </td>

                <td>—</td>

                <td>
                  {formatDateTime(
                    transaction.startedAt
                  )}
                </td>

                <td>
                  {formatDateTime(
                    transaction.completedAt
                  )}
                </td>

                <td>
                  <TransactionStatusBadge
                    status={status}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;