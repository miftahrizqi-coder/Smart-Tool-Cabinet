import api from "./api";

const transactionService = {
  getTransactions() {
    return api.get("/transactions");
  },
  /**
   * Create transaction
   */
  createTransaction(data) {
    return api.post(
      "/transactions",
      data
    );
  },

  /**
   * Get active transaction by employee
   */
  getActiveTransaction(employeeId) {
    return api.get(
      `/transactions/employee/${employeeId}/active`
    );
  },

  /**
   * Get transaction detail
   */
  getTransactionById(transactionId) {
    return api.get(
      `/transactions/${transactionId}`
    );
  },

  /**
   * Get transaction items
   */
  getTransactionItems(transactionId) {
    return api.get(
      `/transactions/${transactionId}/items`
    );
  },

  /**
   * Add item to transaction
   */
  addTransactionItem(
    transactionId,
    data
  ) {
    return api.post(
      `/transactions/${transactionId}/items`,
      data
    );
  },

  /**
   * Return transaction item
   */
  returnTransactionItem(
    transactionId,
    itemId
  ) {
    return api.post(
      `/transactions/${transactionId}/items/${itemId}/return`
    );
  },
};

export default transactionService;