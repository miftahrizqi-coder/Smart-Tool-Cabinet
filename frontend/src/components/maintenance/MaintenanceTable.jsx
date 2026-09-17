import MaintenanceStatusBadge from "./MaintenanceStatusBadge.jsx";
import MaintenancePriorityBadge from "./MaintenancePriorityBadge.jsx";

function MaintenanceTable({
  records,
  onOpenMaintenance,
}) {
  return (
    <div className="maintenance-table-wrapper">
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Maintenance</th>
            <th>Tool</th>
            <th>Cabinet</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Reported</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="maintenance-row"
              onClick={() =>
                onOpenMaintenance(record.id)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  onOpenMaintenance(record.id);
                }
              }}
              tabIndex={0}
            >
              <td className="maintenance-id">
                {record.id}
              </td>

              <td>
                <div>
                  <strong>
                    {record.toolName}
                  </strong>

                  <small>
                    {record.assetNumber}
                  </small>
                </div>
              </td>

              <td className="maintenance-cabinet">
                {record.cabinetId}
                {" / "}
                Slot {record.slotNumber}
              </td>

              <td>
                {record.issue}
              </td>

              <td>
                <MaintenancePriorityBadge
                  priority={record.priority}
                />
              </td>

              <td>
                <MaintenanceStatusBadge
                  status={record.status}
                />
              </td>

              <td>
                {record.reportedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceTable;