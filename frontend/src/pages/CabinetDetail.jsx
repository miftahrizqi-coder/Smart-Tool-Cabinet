import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  MapPin,
  Network,
  Cpu,
  Package,
  Activity,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/ui/Card";
import CabinetStatusBadge from "../components/cabinets/CabinetStatusBadge";
import CabinetVisualization from "../components/cabinets/CabinetVisualization";
import DoorControl from "../components/cabinets/DoorControl";

import cabinetService from "../services/cabinetService";

function CabinetDetail() {
  const navigate = useNavigate();
  const { cabinetId } = useParams();

  const [cabinet, setCabinet] = useState(null);
  const [tools, setTools] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [doorState, setDoorState] =
    useState("UNKNOWN");

  const fetchCabinetDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const [cabinetData, toolsData] =
        await Promise.all([
          cabinetService.getCabinetById(
            cabinetId
          ),
          cabinetService.getCabinetTools(
            cabinetId
          ),
        ]);

      setCabinet(cabinetData);

      setTools(
        Array.isArray(toolsData)
          ? toolsData
          : []
      );
    } catch (err) {
      setCabinet(null);
      setTools([]);

      setError(
        err.message ||
          "Failed to load cabinet data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabinetDetail();
  }, [cabinetId]);

  const slots = useMemo(() => {
    if (!cabinet) {
      return [];
    }

    const slotCount =
      cabinet.slotCount || 0;

    return Array.from(
      { length: slotCount },
      (_, index) => {
        const slotNumber = index + 1;

        const tool = tools.find(
          (item) =>
            item.slotNumber === slotNumber
        );

        if (!tool) {
          return {
            slotNumber,
            status: "EMPTY",
            tool: null,
          };
        }

        return {
          slotNumber,
          status: "OCCUPIED",
          tool: {
            toolId:
              tool.toolId ||
              tool.id,

            name:
              tool.name ||
              "Unknown Tool",

            assetNumber:
              tool.assetNumber ||
              "—",

            status:
              tool.status ||
              "UNKNOWN",
          },
        };
      }
    );
  }, [cabinet, tools]);

  const occupiedSlots = useMemo(
    () =>
      slots.filter(
        (slot) =>
          slot.status === "OCCUPIED"
      ).length,
    [slots]
  );

  const handleDoorCommand = (
    command
  ) => {
    console.log(
      "Demo door command:",
      command
    );

    if (
      command?.command ===
      "OPEN_DOOR"
    ) {
      setDoorState("OPEN");
    }

    if (
      command?.command ===
      "CLOSE_DOOR"
    ) {
      setDoorState("CLOSED");
    }
  };

  if (loading) {
    return (
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Loading cabinet...
          </div>

          <div className="stc-empty-state__description">
            Please wait while cabinet data
            is being loaded.
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Failed to load cabinet.
          </div>

          <div className="stc-empty-state__description">
            {error}
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={fetchCabinetDetail}
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  if (!cabinet) {
    return (
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Cabinet not found.
          </div>

          <div className="stc-empty-state__description">
            The cabinet you are looking for
            does not exist.
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={() =>
              navigate("/cabinets")
            }
          >
            Back to Cabinets
          </button>
        </Card>
      </div>
    );
  }

  const status =
    cabinet.status?.toUpperCase();

  return (
    <div className="stc-cabinet-detail">
      <button
        type="button"
        className="stc-back-button"
        onClick={() =>
          navigate("/cabinets")
        }
      >
        <ArrowLeft size={14} />
        Cabinets
      </button>

      <div className="stc-cabinet-detail__header">
        <div>
          <div className="stc-cabinet-detail__title-row">
            <h1 className="stc-cabinet-detail__title">
              {cabinet.name || "Unnamed Cabinet"}
            </h1>

            <CabinetStatusBadge
              status={status}
            />
          </div>

          <div className="stc-cabinet-detail__subtitle mono">
            {cabinet.cabinetId}
          </div>

          <div className="stc-cabinet-detail__location">
            <MapPin size={13} />
            {cabinet.location || "—"}
          </div>
        </div>
      </div>

      <section className="stc-cabinet-detail__summary">
        <Card padding="sm">
          <div className="stc-detail-metric">
            <Package size={15} />

            <div>
              <span>
                Tool Occupancy
              </span>

              <strong className="mono">
                {occupiedSlots} /{" "}
                {cabinet.slotCount ?? "—"}
              </strong>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="stc-detail-metric">
            <Activity size={15} />

            <div>
              <span>
                Active Transactions
              </span>

              <strong className="mono">
                —
              </strong>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="stc-detail-metric">
            <Network size={15} />

            <div>
              <span>
                Door State
              </span>

              <strong className="mono">
                {doorState}
              </strong>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="stc-detail-metric">
            <Cpu size={15} />

            <div>
              <span>
                Firmware
              </span>

              <strong className="mono">
                —
              </strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="stc-cabinet-detail__grid">
        <div className="stc-cabinet-detail__main">
          <CabinetVisualization
            cabinetId={
              cabinet.cabinetId
            }
            slots={slots}
          />
        </div>

        <aside className="stc-cabinet-detail__side">
          <DoorControl
            cabinet={{
              ...cabinet,
              id: cabinet.cabinetId,
              label: cabinet.name,
              door: doorState,
            }}
            onCommand={
              handleDoorCommand
            }
          />

          <Card padding="default">
            <div className="stc-detail-info">
              <div>
                <span>IP Address</span>

                <strong className="mono">
                  —
                </strong>
              </div>

              <div>
                <span>Firmware</span>

                <strong className="mono">
                  —
                </strong>
              </div>

              <div>
                <span>Last Seen</span>

                <strong>
                  —
                </strong>
              </div>

              <div>
                <span>Last Activity</span>

                <strong>
                  —
                </strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default CabinetDetail;