import EmployeeStatusBadge from "./EmployeeStatusBadge.jsx";

function EmployeeCard({ employee, onOpen }) {
  return (
    <button
      type="button"
      className="employee-card"
      onClick={() => onOpen(employee.id)}
    >
      <div className="employee-card-header">
        <div>
          <div className="employee-card-name">
            {employee.name}
          </div>

          <div className="employee-card-id">
            {employee.id}
          </div>
        </div>

        <EmployeeStatusBadge status={employee.status} />
      </div>

      <div className="employee-card-info">
        <div>
          <span>Department</span>
          <strong>{employee.department}</strong>
        </div>

        <div>
          <span>Position</span>
          <strong>{employee.position}</strong>
        </div>

        <div>
          <span>RFID UID</span>
          <strong>{employee.rfidUid}</strong>
        </div>

        <div>
          <span>Active Transactions</span>
          <strong>{employee.activeTransactions}</strong>
        </div>
      </div>
    </button>
  );
}

export default EmployeeCard;