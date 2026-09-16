import api from "./api";

const cabinetService = {
  getCabinets() {
    return api.get("/cabinets/");
  },

  getCabinetById(cabinetId) {
    return api.get(`/cabinets/${cabinetId}`);
  },

  getCabinetTools(cabinetId) {
    return api.get(`/cabinets/${cabinetId}/tools`);
  },

  createCabinet(data) {
    return api.post("/cabinets/", data);
  },

  updateCabinet(cabinetId, data) {
    return api.patch(`/cabinets/${cabinetId}`, data);
  },

  updateCabinetStatus(cabinetId, data) {
    return api.patch(
      `/cabinets/${cabinetId}/status`,
      data
    );
  },
};

export default cabinetService;