import MaintenanceStatusBadge from "./MaintenanceStatusBadge.jsx";
import MaintenancePriorityBadge from "./MaintenancePriorityBadge.jsx";

function MaintenanceCard({
  record,
  onOpen,
}) {
  return (
    <button
      type="button"
      className="maintenance-card"
      onClick={() => onOpen(record.id)}
    >
      <div className="maintenance-card-header">
        <div>
          <div className="maintenance-card-id">
            {record.id}
          </div>

          <div className="maintenance-card-tool">
            {record.toolName}
          </div>

          <div className="maintenance-card-asset">
            {record.assetNumber}
          </div>
        </div>

        <div className="maintenance-card-badges">
          <MaintenancePriorityBadge
            priority={record.priority}
          />

          <MaintenanceStatusBadge
            status={record.status}
          />
        </div>
      </div>

      <div className="maintenance-card-issue">
        {record.issue}
      </div>

      <div className="maintenance-card-info">
        <div>
          <span>Cabinet</span>
          <strong>
            {record.cabinetId}
          </strong>
        </div>

        <div>
          <span>Slot</span>
          <strong>
            {record.slotNumber}
          </strong>
        </div>

        <div>
          <span>Usage</span>
          <strong>
            {record.usageCount} /{" "}
            {record.maintenanceThreshold}
          </strong>
        </div>

        <div>
          <span>Reported</span>
          <strong>
            {record.reportedAt}
          </strong>
        </div>
      </div>
    </button>
  );
}

export default MaintenanceCard;