import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../components/ui/Card.jsx";

import MaintenanceStatusBadge from "../components/maintenance/MaintenanceStatusBadge.jsx";
import MaintenancePriorityBadge from "../components/maintenance/MaintenancePriorityBadge.jsx";

import {
  getMaintenanceById,
} from "../utils/maintenanceMockData.jsx";

function MaintenanceDetail() {
  const { maintenanceId } =
    useParams();

  const navigate = useNavigate();

  const record =
    getMaintenanceById(
      maintenanceId
    );

  if (!record) {
    return (
      <div className="page">
        <Card>
          <div className="maintenance-empty">
            <h3>
              Maintenance record not found
            </h3>

            <p>
              The requested maintenance
              record could not be found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/maintenance")
              }
            >
              Back to Maintenance
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const usagePercentage = Math.min(
    Math.round(
      (record.usageCount /
        record.maintenanceThreshold) *
        100
    ),
    100
  );

  return (
    <div className="page maintenance-detail-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="stc-panel-action"
            onClick={() =>
              navigate("/maintenance")
            }
          >
            ← Maintenance
          </button>

          <h1>{record.id}</h1>

          <p>
            Maintenance record details
          </p>
        </div>

        <div className="maintenance-detail-badges">
          <MaintenancePriorityBadge
            priority={record.priority}
          />

          <MaintenanceStatusBadge
            status={record.status}
          />
        </div>
      </div>

      <div className="maintenance-detail-grid">
        <Card>
          <div className="detail-card-header">
            <h2>
              Maintenance Information
            </h2>
          </div>

          <div className="detail-list">
            <div>
              <span>
                Maintenance ID
              </span>

              <strong>
                {record.id}
              </strong>
            </div>

            <div>
              <span>Issue</span>

              <strong>
                {record.issue}
              </strong>
            </div>

            <div>
              <span>Priority</span>

              <MaintenancePriorityBadge
                priority={record.priority}
              />
            </div>

            <div>
              <span>Status</span>

              <MaintenanceStatusBadge
                status={record.status}
              />
            </div>

            <div>
              <span>Description</span>

              <strong>
                {record.description}
              </strong>
            </div>
          </div>
        </Card>

        <Card>
          <div className="detail-card-header">
            <h2>Tool Information</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Tool</span>

              <strong>
                {record.toolName}
              </strong>
            </div>

            <div>
              <span>Asset Number</span>

              <strong>
                {record.assetNumber}
              </strong>
            </div>

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
          </div>
        </Card>

        <Card>
          <div className="detail-card-header">
            <h2>
              Usage & Maintenance
            </h2>
          </div>

          <div className="maintenance-usage">
            <div className="maintenance-usage-header">
              <span>Tool Usage</span>

              <strong>
                {record.usageCount} /{" "}
                {record.maintenanceThreshold}
              </strong>
            </div>

            <div className="maintenance-progress">
              <div
                style={{
                  width: `${usagePercentage}%`,
                }}
              />
            </div>

            <small>
              {usagePercentage}% of maintenance
              threshold reached
            </small>
          </div>

          <div className="detail-list">
            <div>
              <span>Reported At</span>

              <strong>
                {record.reportedAt}
              </strong>
            </div>

            <div>
              <span>Started At</span>

              <strong>
                {record.startedAt || "—"}
              </strong>
            </div>

            <div>
              <span>Completed At</span>

              <strong>
                {record.completedAt || "—"}
              </strong>
            </div>

            <div>
              <span>Technician</span>

              <strong>
                {record.technician || "—"}
              </strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MaintenanceDetail;