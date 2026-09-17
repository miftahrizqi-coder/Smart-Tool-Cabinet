import api from "./api.js";

export const maintenanceService = {
  getMaintenanceRecords() {
    return api.get("/maintenance");
  },

  getMaintenanceById(maintenanceId) {
    return api.get(
      `/maintenance/${maintenanceId}`
    );
  },
};

export default maintenanceService;