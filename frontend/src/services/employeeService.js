import api from "./api";

const employeeService = {
  getEmployees() {
    return api.get("/employees/");
  },

  getEmployeeById(employeeId) {
    return api.get(
      `/employees/${employeeId}`
    );
  },

  createEmployee(data) {
    return api.post(
      "/employees/",
      data
    );
  },

  updateEmployee(employeeId, data) {
    return api.patch(
      `/employees/${employeeId}`,
      data
    );
  },

  updateEmployeeStatus(
    employeeId,
    data
  ) {
    return api.patch(
      `/employees/${employeeId}/status`,
      data
    );
  },

  verifyEmployee(data) {
    return api.post(
      "/employees/verify",
      data
    );
  },
};

export default employeeService;