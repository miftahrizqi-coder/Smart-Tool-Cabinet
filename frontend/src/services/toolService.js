import api from "./api";

const toolService = {
  getTools() {
    return api.get("/tools/");
  },

  getToolById(toolId) {
    return api.get(`/tools/${toolId}`);
  },

  createTool(data) {
    return api.post("/tools/", data);
  },

  updateTool(toolId, data) {
    return api.patch(`/tools/${toolId}`, data);
  },

  updateToolStatus(toolId, data) {
    return api.patch(`/tools/${toolId}/status`, data);
  },
};

export default toolService;