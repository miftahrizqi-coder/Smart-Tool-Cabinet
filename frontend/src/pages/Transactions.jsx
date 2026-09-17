
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import TransactionCard from "../components/transactions/TransactionCard.jsx";
import { subscribeToCollection } from "../services/firestoreService";

import transactionService from "../services/transactionService.js";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await transactionService.getTransactions();

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    const unsubscribe = subscribeToCollection(
      "transactions",
      (data) => {
        const normalizedTransactions = data.map(
          (transaction) => ({
            ...transaction,
            transactionId:
              transaction.transactionId ||
              transaction.id,
          })
        );

        console.log(
          "Realtime transactions:",
          normalizedTransactions
        );

        setTransactions(normalizedTransactions);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const transactionId =
        transaction.transactionId ||
        "";

      const employeeId =
        transaction.employeeId ||
        "";

      const cabinetId =
        transaction.cabinetId ||
        "";

      const status =
        transaction.status ||
        "";

      const matchesSearch =
        !keyword ||
        transactionId
          .toLowerCase()
          .includes(keyword) ||
        employeeId
          .toLowerCase()
          .includes(keyword) ||
        cabinetId
          .toLowerCase()
          .includes(keyword);

      const normalizedStatus =
        status.toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="page transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>

          <p>
            Monitor tool borrowing and return
            transactions.
          </p>
        </div>
      </div>

      <Card>
        <div className="transaction-toolbar">
          <div className="transaction-search">
            <input
              type="search"
              placeholder="Search transaction..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search transaction"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter transaction status"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="OPEN">
              Open
            </option>

            <option value="COMPLETED">
              Completed
            </option>
          </select>
        </div>

        {loading ? (
          <div className="transaction-empty">
            <h3>Loading transactions...</h3>

            <p>
              Please wait while transaction data
              is being loaded.
            </p>
          </div>
        ) : error ? (
          <div className="transaction-empty">
            <h3>Unable to load transactions</h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchTransactions}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="transaction-result-info">
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1
                ? "s"
                : ""}
            </div>

            {filteredTransactions.length > 0 ? (
              <>
                <div className="transaction-table-view">
                  <TransactionTable
                    transactions={filteredTransactions}
                    onOpenTransaction={(id) =>
                      navigate(
                        `/transactions/${id}`
                      )
                    }
                  />
                </div>

                <div className="transaction-card-view">
                  {filteredTransactions.map(
                    (transaction) => (
                      <TransactionCard
                        key={
                          transaction.transactionId
                        }
                        transaction={{
                          ...transaction,
                          id:
                            transaction.transactionId,
                          status:
                            transaction.status?.toUpperCase(),
                        }}
                        onOpen={(id) =>
                          navigate(
                            `/transactions/${id}`
                          )
                        }
                      />
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="transaction-empty">
                <h3>No transactions found</h3>

                <p>
                  No transactions match the current
                  search or filter.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filter
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default Transactions;
