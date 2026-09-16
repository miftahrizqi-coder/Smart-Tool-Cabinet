import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import EmployeeStatusBadge from "../components/employees/EmployeeStatusBadge.jsx";

import employeeService from "../services/employeeService.js";

function EmployeeDetail() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load employee detail from API
   */
  const loadEmployee = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await employeeService.getEmployeeById(
          employeeId
        );

      setEmployee(data);
    } catch (err) {
      console.error(
        "Failed to load employee detail:",
        err
      );

      setError(
        err.message ||
          "Failed to load employee detail."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial API request
   */
  useEffect(() => {
    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="page employee-detail-page">
        <Card>
          <div className="employee-empty">
            <h3>
              Loading employee...
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
      <div className="page employee-detail-page">
        <Card>
          <div className="employee-empty">
            <h3>
              Failed to load employee
            </h3>

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
                onClick={loadEmployee}
              >
                Retry
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  navigate("/employees")
                }
              >
                Back to Employees
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /**
   * Employee not found
   */
  if (!employee) {
    return (
      <div className="page">
        <Card>
          <div className="employee-empty">
            <h3>
              Employee not found
            </h3>

            <p>
              The requested employee could
              not be found.
            </p>

            <Button
              variant="secondary"
              onClick={() =>
                navigate("/employees")
              }
            >
              Back to Employees
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page employee-detail-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="stc-panel-action"
            onClick={() =>
              navigate("/employees")
            }
          >
            ← Employees
          </button>

          <h1>{employee.name}</h1>

          <p>
            {employee.employeeNumber ||
              employee.id}
          </p>
        </div>

        <EmployeeStatusBadge
          status={employee.status}
        />
      </div>

      <div className="employee-detail-grid">
        <Card>
          <div className="detail-card-header">
            <h2>
              Employee Information
            </h2>
          </div>

          <div className="detail-list">
            <div>
              <span>
                Employee Number
              </span>

              <strong>
                {employee.employeeNumber ||
                  employee.id}
              </strong>
            </div>

            <div>
              <span>Name</span>

              <strong>
                {employee.name}
              </strong>
            </div>

            <div>
              <span>
                Department
              </span>

              <strong>
                {employee.department}
              </strong>
            </div>

            <div>
              <span>Position</span>

              <strong>
                {employee.position}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <EmployeeStatusBadge
                status={employee.status}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="detail-card-header">
            <h2>
              RFID Information
            </h2>
          </div>

          <div className="rfid-panel">
            <div className="rfid-icon">
              RFID
            </div>

            <div>
              <span>RFID UID</span>

              <strong className="rfid-value">
                {employee.rfidUid}
              </strong>
            </div>
          </div>

          <div className="detail-list">
            <div>
              <span>
                Authentication
              </span>

              <strong>
                RFID + PIN
              </strong>
            </div>

            <div>
              <span>
                Card Status
              </span>

              <strong>
                REGISTERED
              </strong>
            </div>
          </div>
        </Card>

        <Card>
          <div className="detail-card-header">
            <h2>Activity</h2>
          </div>

          <div className="employee-activity">
            <div>
              <span>
                Active Transactions
              </span>

              <strong>
                {employee.activeTransactions ??
                  0}
              </strong>
            </div>

            <div>
              <span>
                Last Activity
              </span>

              <strong>
                {employee.lastActivity ||
                  "No activity recorded"}
              </strong>
            </div>

            <div>
              <span>Joined</span>

              <strong>
                {employee.joinedDate ||
                  "—"}
              </strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeDetail;