
import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Lock,
  ArrowLeftRight,
  Radio,
  Info,
  RefreshCw,
  Search,
} from "lucide-react";

import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import useEvents from "../hooks/useEvents.js";


// ============================================================
// COLORS
// ============================================================

const C = {
  canvas: "#010102",
  surface1: "#0B0B0D",
  surface2: "#111114",
  surface3: "#17171B",

  border: "rgba(255,255,255,0.08)",

  textPrimary: "#F2F2F2",
  textSecondary: "#B4B4BC",
  textTertiary: "#777780",

  lavender: "#B9A7FF",

  green: "#69D49A",
  red: "#F27676",
  amber: "#E7B75C",
  blue: "#6FA8FF",
};


// ============================================================
// EVENT HELPERS
// ============================================================

function getEventIcon(eventType) {
  switch (eventType) {
    case "rfid.card_tapped":
      return CreditCard;

    case "auth.pin_entered":
      return Lock;

    case "tool.slot_changed":
      return ArrowLeftRight;

    case "device.status_changed":
      return Radio;

    default:
      return Info;
  }
}


function getEventColor(eventType) {
  switch (eventType) {
    case "rfid.card_tapped":
      return C.blue;

    case "auth.pin_entered":
      return C.blue;

    case "tool.slot_changed":
      return C.amber;

    case "device.status_changed":
      return C.green;

    default:
      return C.textSecondary;
  }
}


function getEventTitle(eventType) {
  switch (eventType) {
    case "rfid.card_tapped":
      return "RFID Card Tapped";

    case "auth.pin_entered":
      return "PIN Authentication";

    case "tool.slot_changed":
      return "Tool Slot Changed";

    case "device.status_changed":
      return "Device Status Changed";

    default:
      return eventType || "Unknown Event";
  }
}


function getEventDescription(event) {
  const result = event?.result || {};

  switch (event?.eventType) {
    case "rfid.card_tapped":
      return result.employeeId
        ? `Employee ${result.employeeId} identified`
        : "RFID card detected";

    case "auth.pin_entered":
      if (result.employeeId) {
        return `Employee ${result.employeeId} authentication`;
      }

      return "PIN authentication event";

    case "tool.slot_changed": {
      const toolId = result.toolId || "Unknown tool";
      const slot = result.slotNumber ?? "-";
      const operation = result.operation || "CHANGED";

      return `${toolId} — Slot ${slot} — ${operation}`;
    }

    case "device.status_changed":
      return `Cabinet ${event.cabinetId || "-" } status changed`;

    default:
      return `Cabinet ${event?.cabinetId || "-"}`;
  }
}


function formatEventTime(timestamp) {
  if (!timestamp) {
    return "-";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function getStatusType(status) {
  switch (String(status || "").toLowerCase()) {
    case "accepted":
    case "success":
    case "completed":
    case "authenticated":
    case "employee_identified":
      return "success";

    case "rejected":
    case "failed":
    case "error":
      return "failed";

    case "ignored":
      return "warning";

    default:
      return "info";
  }
}


function getOperationType(operation) {
  switch (String(operation || "").toUpperCase()) {
    case "BORROW":
      return "warning";

    case "RETURN":
      return "success";

    default:
      return "info";
  }
}


// ============================================================
// EVENT ROW
// ============================================================

function EventRow({ event }) {
  const Icon = getEventIcon(event.eventType);
  const iconColor = getEventColor(event.eventType);

  const result = event.result || {};
  const operation = result.operation;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "42px minmax(260px, 1fr) 170px 140px 130px",
        gap: 16,
        alignItems: "center",

        padding: "14px 16px",

        borderBottom: `1px solid ${C.border}`,

        transition: "background 0.15s ease",
      }}
      className="event-row"
    >
      {/* ICON */}

      <div
        style={{
          width: 32,
          height: 32,

          borderRadius: 8,

          background: "rgba(255,255,255,0.04)",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          size={15}
          strokeWidth={1.8}
          color={iconColor}
        />
      </div>


      {/* EVENT */}

      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: C.textPrimary,
            }}
          >
            {getEventTitle(event.eventType)}
          </span>

          {operation && (
            <Badge
            status={getOperationType(operation)}
            >
            {String(operation).toUpperCase()}
            </Badge>
          )}
        </div>

        <div
          style={{
            fontSize: 12,
            color: C.textSecondary,

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getEventDescription(event)}
        </div>

        <div
          style={{
            marginTop: 4,

            fontSize: 10.5,
            color: C.textTertiary,

            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {event.eventId}
        </div>
      </div>


      {/* CABINET */}

      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: C.textTertiary,
            marginBottom: 3,
          }}
        >
          Cabinet
        </div>

        <div
          style={{
            fontSize: 12,
            color: C.textSecondary,

            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, monospace",

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.cabinetId || "-"}
        </div>
      </div>


      {/* STATUS */}

      <div>
        <Badge status={getStatusType(event.status)}>
        {String(event.status || "UNKNOWN").toUpperCase()}
        </Badge>
      </div>


      {/* TIME */}

      <div
        style={{
          fontSize: 11,
          color: C.textTertiary,

          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, monospace",

          whiteSpace: "nowrap",
        }}
      >
        {formatEventTime(event.timestamp)}
      </div>
    </div>
  );
}


// ============================================================
// EVENTS PAGE
// ============================================================

export default function Events() {
  const {
    events,
    loading,
    error,
    refresh,
  } = useEvents(50);

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("ALL");
  const [status, setStatus] = useState("ALL");


  // ==========================================================
  // FILTER EVENTS
  // ==========================================================

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        String(event.eventId || "")
          .toLowerCase()
          .includes(query) ||
        String(event.eventType || "")
          .toLowerCase()
          .includes(query) ||
        String(event.cabinetId || "")
          .toLowerCase()
          .includes(query) ||
        String(event.result?.employeeId || "")
          .toLowerCase()
          .includes(query) ||
        String(event.result?.toolId || "")
          .toLowerCase()
          .includes(query);

      const matchesEventType =
        eventType === "ALL" ||
        event.eventType === eventType;

      const matchesStatus =
        status === "ALL" ||
        String(event.status || "").toUpperCase() === status;

      return (
        matchesSearch &&
        matchesEventType &&
        matchesStatus
      );
    });
  }, [
    events,
    search,
    eventType,
    status,
  ]);


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 600,
              color: C.textPrimary,
            }}
          >
            Events
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: C.textTertiary,
            }}
          >
            Monitor system events and device activity.
          </p>
        </div>

        <Card
          style={{
            padding: 32,
            minHeight: 180,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,

              fontSize: 13,
              color: C.textTertiary,
            }}
          >
            <RefreshCw
              size={15}
              className="spin"
            />

            Loading events...
          </div>
        </Card>

        <style>{`
          .spin {
            animation: eventSpin 1s linear infinite;
          }

          @keyframes eventSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }


  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 600,
              color: C.textPrimary,
            }}
          >
            Events
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: C.textTertiary,
            }}
          >
            Monitor system events and device activity.
          </p>
        </div>

        <Card
          style={{
            padding: 32,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            textAlign: "center",
          }}
        >
          <Info
            size={24}
            color={C.red}
            style={{
              marginBottom: 12,
            }}
          />

          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: C.textPrimary,
            }}
          >
            Failed to load events
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: C.textTertiary,
            }}
          >
            {error}
          </div>

          <button
            type="button"
            onClick={refresh}
            style={{
              marginTop: 16,

              display: "flex",
              alignItems: "center",
              gap: 7,

              padding: "8px 12px",

              border: `1px solid ${C.border}`,
              borderRadius: 8,

              background: C.surface2,
              color: C.textSecondary,

              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={13} />

            Retry
          </button>
        </Card>
      </div>
    );
  }


  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,

              fontSize: 24,
              fontWeight: 600,

              color: C.textPrimary,
            }}
          >
            Events
          </h1>

          <p
            style={{
              margin: "6px 0 0",

              fontSize: 13,
              color: C.textTertiary,
            }}
          >
            Monitor system events and device activity.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,

            padding: "8px 12px",

            border: `1px solid ${C.border}`,
            borderRadius: 8,

            background: C.surface2,
            color: C.textSecondary,

            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} />

          Refresh
        </button>
      </div>


      {/* FILTERS */}

      <Card
        style={{
          padding: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {/* SEARCH */}

          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: 240,
            }}
          >
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.textTertiary,
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search events..."
              style={{
                width: "100%",

                height: 36,

                padding:
                  "0 12px 0 34px",

                border:
                  `1px solid ${C.border}`,

                borderRadius: 8,

                outline: "none",

                background: C.surface2,
                color: C.textPrimary,

                fontSize: 12,
              }}
            />
          </div>


          {/* EVENT TYPE */}

          <select
            value={eventType}
            onChange={(e) =>
              setEventType(e.target.value)
            }
            style={{
              height: 36,

              padding: "0 12px",

              border:
                `1px solid ${C.border}`,

              borderRadius: 8,

              background: C.surface2,
              color: C.textSecondary,

              fontSize: 12,

              outline: "none",

              cursor: "pointer",
            }}
          >
            <option value="ALL">
              All event types
            </option>

            <option value="rfid.card_tapped">
              RFID
            </option>

            <option value="auth.pin_entered">
              Authentication
            </option>

            <option value="tool.slot_changed">
              Tool
            </option>

            <option value="device.status_changed">
              Device Status
            </option>
          </select>


          {/* STATUS */}

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            style={{
              height: 36,

              padding: "0 12px",

              border:
                `1px solid ${C.border}`,

              borderRadius: 8,

              background: C.surface2,
              color: C.textSecondary,

              fontSize: 12,

              outline: "none",

              cursor: "pointer",
            }}
          >
            <option value="ALL">
              All status
            </option>

            <option value="ACCEPTED">
              Accepted
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="FAILED">
              Failed
            </option>

            <option value="ERROR">
              Error
            </option>

            <option value="IGNORED">
              Ignored
            </option>

            <option value="AUTHENTICATED">
              Authenticated
            </option>

            <option value="EMPLOYEE_IDENTIFIED">
              Employee Identified
            </option>
          </select>
        </div>
      </Card>


      {/* EVENT TABLE */}

      <Card
        style={{
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "42px minmax(260px, 1fr) 170px 140px 130px",

            gap: 16,
            alignItems: "center",

            padding: "11px 16px",

            borderBottom:
              `1px solid ${C.border}`,

            background: C.surface1,

            fontSize: 10.5,
            fontWeight: 500,

            color: C.textTertiary,

            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <div />

          <div>
            Event
          </div>

          <div>
            Cabinet
          </div>

          <div>
            Status
          </div>

          <div>
            Time
          </div>
        </div>


        {/* EMPTY STATE */}

        {filteredEvents.length === 0 ? (
          <div
            style={{
              minHeight: 220,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              textAlign: "center",
            }}
          >
            <Info
              size={22}
              color={C.textTertiary}
              style={{
                marginBottom: 10,
              }}
            />

            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: C.textSecondary,
              }}
            >
              No events found
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 11,
                color: C.textTertiary,
              }}
            >
              Try changing your search or filters.
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventRow
              key={event.eventId}
              event={event}
            />
          ))
        )}
      </Card>


      {/* FOOTER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          fontSize: 11,
          color: C.textTertiary,
        }}
      >
        <span>
          Showing {filteredEvents.length} of{" "}
          {events.length} events
        </span>

        <span
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          API: /api/v1/events/
        </span>
      </div>


      {/* ROW HOVER */}

      <style>{`
        .event-row:hover {
          background: ${C.surface2};
        }

        input::placeholder {
          color: ${C.textTertiary};
        }

        select option {
          background: ${C.surface2};
          color: ${C.textPrimary};
        }
      `}</style>
    </div>
  );
}
