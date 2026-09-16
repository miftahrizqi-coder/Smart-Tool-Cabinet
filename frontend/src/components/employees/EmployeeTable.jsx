import EmployeeStatusBadge from "./EmployeeStatusBadge.jsx";

function EmployeeTable({ employees, onOpenEmployee }) {
  return (
    <div className="employee-table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee Number</th>
            <th>Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>RFID UID</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="employee-row"
              onClick={() => onOpenEmployee(employee.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onOpenEmployee(employee.id);
                }
              }}
              tabIndex={0}
            >
              <td className="employee-id">
                {employee.id}
              </td>

              <td>
                {employee.name}
              </td>

              <td>
                {employee.department}
              </td>

              <td>
                {employee.position}
              </td>

              <td className="employee-rfid">
                {employee.rfidUid}
              </td>

              <td>
                <EmployeeStatusBadge status={employee.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;