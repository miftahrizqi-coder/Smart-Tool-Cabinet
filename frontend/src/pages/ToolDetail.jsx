import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Package,
  MapPin,
  Tag,
  Clock,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../components/ui/Card";

import ToolStatusBadge from "../components/tools/ToolStatusBadge";
import ToolUsageSummary from "../components/tools/ToolUsageSummary";

import toolService from "../services/toolService";

function ToolDetail() {
  const navigate = useNavigate();

  const { toolId } = useParams();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load tool detail from API
   */
  const loadTool = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await toolService.getToolById(toolId);

      setTool(data);
    } catch (err) {
      console.error(
        "Failed to load tool detail:",
        err
      );

      setError(
        err.message ||
          "Failed to load tool detail."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial API request
   */
  useEffect(() => {
    if (toolId) {
      loadTool();
    }
  }, [toolId]);

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Loading tool...
          </div>

          <div className="stc-empty-state__description">
            Please wait while tool data
            is being loaded.
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
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Failed to load tool.
          </div>

          <div className="stc-empty-state__description">
            {error}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="stc-panel-action"
              onClick={loadTool}
            >
              Retry
            </button>

            <button
              type="button"
              className="stc-panel-action"
              onClick={() =>
                navigate("/tools")
              }
            >
              Back to Tools
            </button>
          </div>
        </Card>
      </div>
    );
  }

  /**
   * Tool not found
   */
  if (!tool) {
    return (
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Tool not found.
          </div>

          <div className="stc-empty-state__description">
            The tool you are looking for
            does not exist.
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={() =>
              navigate("/tools")
            }
          >
            Back to Tools
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="stc-tool-detail">
      <button
        type="button"
        className="stc-back-button"
        onClick={() =>
          navigate("/tools")
        }
      >
        <ArrowLeft size={14} />
        Tools
      </button>

      <div className="stc-tool-detail__header">
        <div>
          <div className="stc-tool-detail__title-row">
            <h1 className="stc-tool-detail__title">
              {tool.name}
            </h1>

            <ToolStatusBadge
              status={tool.status}
            />
          </div>

          <div className="stc-tool-detail__asset mono">
            {tool.assetNumber}
          </div>
        </div>
      </div>

      <section className="stc-tool-detail__summary">
        <Card padding="sm">
          <div className="stc-detail-metric">
            <Package size={15} />

            <div>
              <span>
                Category
              </span>

              <strong>
                {tool.category}
              </strong>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="stc-detail-metric">
            <MapPin size={15} />

            <div>
              <span>
                Cabinet
              </span>

              <strong className="mono">
                {tool.cabinetId}
              </strong>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="stc-detail-metric">
            <Tag size={15} />

            <div>
              <span>
                Slot
              </span>

              <strong className="mono">
                {String(
                  tool.slotNumber
                ).padStart(2, "0")}
              </strong>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="stc-detail-metric">
            <Clock size={15} />

            <div>
              <span>
                Usage Count
              </span>

              <strong className="mono">
                {tool.usageCount}
              </strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="stc-tool-detail__grid">
        <div className="stc-tool-detail__main">
          <ToolUsageSummary
            tool={tool}
          />

          <Card padding="default">
            <div className="stc-tool-detail__section-title">
              Tool Information
            </div>

            <div className="stc-detail-info">
              <div>
                <span>Tool ID</span>

                <strong className="mono">
                  {tool.toolId}
                </strong>
              </div>

              <div>
                <span>Asset Number</span>

                <strong className="mono">
                  {tool.assetNumber}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {tool.status}
                </strong>
              </div>

              <div>
                <span>Category</span>

                <strong>
                  {tool.category}
                </strong>
              </div>

              <div>
                <span>
                  Usage Count
                </span>

                <strong className="mono">
                  {tool.usageCount}
                </strong>
              </div>

              <div>
                <span>
                  Usage Duration
                </span>

                <strong className="mono">
                  {tool.totalUsageDuration}
                </strong>
              </div>
            </div>
          </Card>
        </div>

        <aside className="stc-tool-detail__side">
          <Card padding="default">
            <div className="stc-tool-detail__section-title">
              Current Location
            </div>

            <div className="stc-tool-location">
              <MapPin size={16} />

              <div>
                <strong>
                  {tool.cabinetId}
                </strong>

                <span className="mono">
                  Slot{" "}
                  {String(
                    tool.slotNumber
                  ).padStart(2, "0")}
                </span>

                <span>
                  Tool is currently{" "}
                  {tool.status
                    ?.toLowerCase()
                    .replace(
                      "_",
                      " "
                    )}
                </span>
              </div>
            </div>
          </Card>

          <Card padding="default">
            <div className="stc-tool-detail__section-title">
              Maintenance
            </div>

            <div className="stc-detail-info">
              <div>
                <span>
                  Maintenance Status
                </span>

                <strong>
                  {tool.maintenanceStatus}
                </strong>
              </div>

              <div>
                <span>
                  Warning Threshold
                </span>

                <strong className="mono">
                  {
                    tool.maintenanceWarningThreshold
                  }
                </strong>
              </div>

              <div>
                <span>
                  Maintenance Threshold
                </span>

                <strong className="mono">
                  {
                    tool.maintenanceThreshold
                  }
                </strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default ToolDetail;