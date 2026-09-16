import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import EmployeeTable from "../components/employees/EmployeeTable.jsx";
import EmployeeCard from "../components/employees/EmployeeCard.jsx";
import employeeService from "../services/employeeService.js";

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  /**
   * Load employees from API
   */
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await employeeService.getEmployees();

      setEmployees(data);
    } catch (err) {
      console.error(
        "Failed to load employees:",
        err
      );

      setError(
        err.message ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial API request
   */
  useEffect(() => {
    loadEmployees();
  }, []);

  /**
   * Filter employees
   */
  const filteredEmployees = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !keyword ||
        employee.employeeNumber
          ?.toLowerCase()
          .includes(keyword) ||
        employee.name
          ?.toLowerCase()
          .includes(keyword) ||
        employee.department
          ?.toLowerCase()
          .includes(keyword) ||
        employee.position
          ?.toLowerCase()
          .includes(keyword) ||
        employee.rfidUid
          ?.toLowerCase()
          .includes(keyword) ||
        employee.id
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    statusFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="page employees-page">
        <div className="page-header">
          <div>
            <h1>Employees</h1>
            <p>
              Manage employee identities and
              RFID information.
            </p>
          </div>
        </div>

        <Card>
          <div className="employee-empty">
            <h3>
              Loading employees...
            </h3>

            <p>
              Please wait while employee
              data is being loaded.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="page employees-page">
        <div className="page-header">
          <div>
            <h1>Employees</h1>
            <p>
              Manage employee identities and
              RFID information.
            </p>
          </div>
        </div>

        <Card>
          <div className="employee-empty">
            <h3>
              Failed to load employees
            </h3>

            <p>{error}</p>

            <Button
              variant="secondary"
              onClick={loadEmployees}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page employees-page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>

          <p>
            Manage employee identities and
            RFID information.
          </p>
        </div>

        <Button variant="primary">
          + Add Employee
        </Button>
      </div>

      <Card>
        <div className="employee-toolbar">
          <div className="employee-search">
            <input
              type="search"
              placeholder="Search employee..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              aria-label="Search employee"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            aria-label="Filter employee status"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>

        <div className="employee-result-info">
          <span>
            {filteredEmployees.length}{" "}
            employee
            {filteredEmployees.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {filteredEmployees.length > 0 ? (
          <>
            <div className="employee-table-view">
              <EmployeeTable
                employees={
                  filteredEmployees
                }
                onOpenEmployee={(id) =>
                  navigate(
                    `/employees/${id}`
                  )
                }
              />
            </div>

            <div className="employee-card-view">
              {filteredEmployees.map(
                (employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onOpen={(id) =>
                      navigate(
                        `/employees/${id}`
                      )
                    }
                  />
                )
              )}
            </div>
          </>
        ) : (
          <div className="employee-empty">
            <h3>
              No employees found
            </h3>

            <p>
              There are no employees
              matching your current
              filter.
            </p>

            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              Clear Filter
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Employees;