import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import TransactionStatusBadge from "../components/transactions/TransactionStatusBadge.jsx";

import transactionService from "../services/transactionService.js";

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

function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await transactionService.getTransactionById(
          transactionId
        );

      setTransaction(data);
    } catch (err) {
      setTransaction(null);
      setError(
        err.message ||
          "Failed to load transaction data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="page">
        <Card>
          <div className="transaction-empty">
            <h3>Loading transaction...</h3>
            <p>
              Please wait while transaction data is
              being loaded.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Card>
          <div className="transaction-empty">
            <h3>Failed to load transaction</h3>

            <p>{error}</p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <Button
                variant="secondary"
                onClick={() =>
                  navigate("/transactions")
                }
              >
                Back to Transactions
              </Button>

              <Button
                variant="primary"
                onClick={fetchTransaction}
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="page">
        <Card>
          <div className="transaction-empty">
            <h3>Transaction not found</h3>

            <p>
              The requested transaction could not
              be found.
            </p>

            <Button
              variant="secondary"
              onClick={() =>
                navigate("/transactions")
              }
            >
              Back to Transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const status =
    transaction.status?.toUpperCase();

  const items = transaction.items || [];

  return (
    <div className="page transaction-detail-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="stc-panel-action"
            onClick={() =>
              navigate("/transactions")
            }
          >
            ← Transactions
          </button>

          <h1>
            {transaction.transactionId}
          </h1>

          <p>
            Transaction detail and tool activity
          </p>
        </div>

        <TransactionStatusBadge
          status={status}
        />
      </div>

      <div className="transaction-detail-grid">
        <Card>
          <div className="detail-card-header">
            <h2>
              Transaction Information
            </h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Transaction ID</span>
              <strong>
                {transaction.transactionId}
              </strong>
            </div>

            <div>
              <span>Employee</span>
              <strong>
                {transaction.employeeId ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Cabinet</span>
              <strong>
                {transaction.cabinetId || "—"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {status || "—"}
              </strong>
            </div>

            <div>
              <span>Start Time</span>
              <strong>
                {formatDateTime(
                  transaction.startedAt
                )}
              </strong>
            </div>

            <div>
              <span>End Time</span>
              <strong>
                {formatDateTime(
                  transaction.completedAt
                )}
              </strong>
            </div>

            <div>
              <span>Created At</span>
              <strong>
                {formatDateTime(
                  transaction.createdAt
                )}
              </strong>
            </div>

            <div>
              <span>Updated At</span>
              <strong>
                {formatDateTime(
                  transaction.updatedAt
                )}
              </strong>
            </div>
          </div>
        </Card>

        <Card>
          <div className="detail-card-header">
            <h2>
              Transaction Items
            </h2>
          </div>

          {items.length > 0 ? (
            <div className="transaction-items">
              {items.map((item) => (
                <div
                  key={
                    item.transactionItemId
                  }
                  className="transaction-item"
                >
                  <div>
                    <strong>
                      {item.toolName ||
                        item.toolId ||
                        "Unknown Tool"}
                    </strong>

                    <span>
                      {item.assetNumber || "—"}
                    </span>
                  </div>

                  <div>
                    <span>Slot</span>
                    <strong>
                      {item.slotNumber ?? "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Taken</span>
                    <strong>
                      {formatDateTime(
                        item.takenAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Returned</span>
                    <strong>
                      {formatDateTime(
                        item.returnedAt
                      )}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="transaction-empty">
              <h3>No transaction items</h3>

              <p>
                No tools have been recorded in
                this transaction.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default TransactionDetail;