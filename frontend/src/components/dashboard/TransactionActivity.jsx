import React from "react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

function OperationBadge({ operation }) {
  const isBorrow = operation === "BORROW";

  return (
    <span
      className={
        isBorrow
          ? "stc-operation-badge stc-operation-badge--borrow"
          : "stc-operation-badge stc-operation-badge--return"
      }
    >
      {operation}
    </span>
  );
}

function formatDateTime(value) {
  if (!value) return "—";

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

function TransactionActivity({
  transactions = [],
  transactionItems = {},
  tools=[],
  onViewAll,
}) {
  const rows = transactions
    .flatMap((transaction) => {
      const transactionId =
        transaction.transactionId ||
        transaction.id;

      const items =
        transactionItems[transactionId] || [];

      if (items.length === 0) {
        return [
          {
            transaction,
            item: null,
            rowId: transactionId,
          },
        ];
      }

      return items.map((item, index) => ({
        transaction,
        item,
        rowId:
          item.transactionItemId ||
          item.id ||
          `${transactionId}-${index}`,
      }));
    })
    .sort((a, b) => {
      const getTime = ({ transaction, item }) => {
        const value = item
          ? item.returnedAt ||
            item.takenAt
          : transaction.startedAt;

        if (!value) return 0;

        if (value?.toDate) {
          return value.toDate().getTime();
        }

        if (value instanceof Date) {
          return value.getTime();
        }

        const date = new Date(value);

        return Number.isNaN(date.getTime())
          ? 0
          : date.getTime();
      };

      return getTime(b) - getTime(a);
    });


  return (
    <Card
      className="stc-dashboard-panel stc-transaction-panel"
      padding="none"
    >
      <div className="stc-panel-header">
        <h2 className="stc-panel-title">
          Recent Transactions
        </h2>

        <button
          type="button"
          className="stc-panel-action"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      <div className="stc-table-wrapper">
        <table className="stc-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Employee</th>
              <th>Tool</th>
              <th>Cabinet</th>
              <th>Operation</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(({ transaction, item, rowId }) => {
              const transactionId =
                transaction.transactionId || transaction.id;

              const tool = item
                ? tools.find(
                    (tool) =>
                      tool.toolId === item.toolId ||
                      tool.id === item.toolId
                  )
                : null;

              const operation = item
                ? item.returnedAt
                  ? "RETURN"
                  : "BORROW"
                : "—";

              const time = item
                ? item.returnedAt || item.takenAt
                : transaction.startedAt;

              return (
                <tr key={rowId}>
                  <td className="mono">{transactionId}</td>

                  <td className="mono">
                    {transaction.employeeId || "—"}
                  </td>

                  <td>
                    {tool?.name || item?.toolId || "—"}
                  </td>

                  <td className="mono">
                    {item?.cabinetId ||
                      transaction.cabinetId ||
                      tool?.cabinetId ||
                      "—"}
                  </td>

                  <td>
                    {operation !== "—" ? (
                      <OperationBadge operation={operation} />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="mono">
                    {formatDateTime(time)}
                  </td>

                  <td>
                    <Badge
                      status={
                        transaction.status?.toLowerCase() || "unknown"
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TransactionActivity;