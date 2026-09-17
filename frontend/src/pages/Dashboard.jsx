
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Wrench,
  ArrowLeftRight,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useEvents from "../hooks/useEvents.js";

import SummaryCard from "../components/dashboard/SummaryCard";
import CabinetStatus from "../components/dashboard/CabinetStatus";
import ToolStatus from "../components/dashboard/ToolStatus";
import RecentEvents from "../components/dashboard/RecentEvents";
import TransactionActivity from "../components/dashboard/TransactionActivity";
import UsageAnalytics from "../components/dashboard/UsageAnalytics";
import MaintenanceAlerts from "../components/dashboard/MaintenanceAlerts";
import SystemHealth from "../components/dashboard/SystemHealth";
import CabinetVisualization from "../components/cabinets/CabinetVisualization";

import {
  subscribeToCollection,
  subscribeToTransactionItems,
} from "../services/firestoreService";

import {
  USAGE_7D,
  ALERTS,
} from "../utils/dashboardMockData";

function mapEventToRecentEvent(event) {
  const result = event?.result || {};

  let icon = "conn";
  let title = "System Event";
  let desc = "System event detected";

  switch (event?.eventType) {
    case "rfid.card_tapped":
      icon = "rfid";
      title = "RFID Card Tapped";

      desc = result.employeeId
        ? `Employee ${result.employeeId} identified`
        : "RFID card detected";

      break;

    case "auth.pin_entered":
      icon = "pin";
      title = "PIN Authentication";

      desc = result.employeeId
        ? `Employee ${result.employeeId} authentication`
        : "PIN authentication event";

      break;

    case "tool.slot_changed":
      if (
        String(result.operation || "").toUpperCase() ===
        "BORROW"
      ) {
        icon = "borrow";
        title = "Tool Borrowed";
      } else if (
        String(result.operation || "").toUpperCase() ===
        "RETURN"
      ) {
        icon = "return";
        title = "Tool Returned";
      } else {
        icon = "borrow";
        title = "Tool Slot Changed";
      }

      desc = result.toolId
        ? `${result.toolId} · Slot ${result.slotNumber ?? "-"}`
        : `Slot ${result.slotNumber ?? "-"}`;

      break;

    case "device.status_changed":
      icon = "conn";
      title = "Device Status Changed";

      desc = event.cabinetId
        ? `Cabinet ${event.cabinetId} status changed`
        : "Cabinet status changed";

      break;

    default:
      icon = "conn";
      title = event?.eventType || "System Event";
      desc = event?.cabinetId
        ? `Cabinet ${event.cabinetId}`
        : "System event detected";
  }

  const date = event?.timestamp
    ? new Date(event.timestamp)
    : null;

  const time =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return {
    icon,
    title,
    desc,
    time,
    eventId: event.eventId,
    eventType: event.eventType,
    status: event.status,
  };
}

function Dashboard() {
  const navigate = useNavigate();

  const [tools, setTools] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionItems, setTransactionItems] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loaded, setLoaded] = useState({
    tools: false,
    cabinets: false,
    transactions: false,
  });

  // ---------------------------------------------------
  // Realtime Events
  // ---------------------------------------------------
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refresh: refreshEvents,
  } = useEvents(50);


  // ---------------------------------------------------
  // Realtime Tools
  // ---------------------------------------------------
  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "tools",
      (data) => {
        setTools(data);

        setLoaded((prev) => ({
          ...prev,
          tools: true,
        }));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);


  // ---------------------------------------------------
  // Realtime Cabinets
  // ---------------------------------------------------
  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "cabinets",
      (data) => {
        setCabinets(data);

        setLoaded((prev) => ({
          ...prev,
          cabinets: true,
        }));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);


  // ---------------------------------------------------
  // Realtime Transactions
  // ---------------------------------------------------
  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "transactions",
      (data) => {
        setTransactions(data);

        setLoaded((prev) => ({
          ...prev,
          transactions: true,
        }));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);


  // ---------------------------------------------------
  // Realtime Transaction Items
  // ---------------------------------------------------
  useEffect(() => {
    if (transactions.length === 0) {
      setTransactionItems({});
      return;
    }

    const unsubscribers = [];

    transactions.forEach((transaction) => {
      const transactionId =
        transaction.transactionId ||
        transaction.id;

      if (!transactionId) return;

      const unsubscribe =
        subscribeToTransactionItems(
          transactionId,
          (items) => {
            setTransactionItems((prev) => ({
              ...prev,
              [transactionId]: items,
            }));
          }
        );

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [transactions]);


  // ---------------------------------------------------
  // Loading State
  // ---------------------------------------------------
  useEffect(() => {
    if (
      loaded.tools &&
      loaded.cabinets &&
      loaded.transactions
    ) {
      setLoading(false);
    }
  }, [loaded]);


  // ---------------------------------------------------
  // Cabinet Slot Data
  // ---------------------------------------------------
  const cabinetSlots = useMemo(() => {
    const cabinetId = "CAB-DF11099F";

    return tools
      .filter(
        (tool) =>
          tool.cabinetId === cabinetId
      )
      .map((tool) => ({
        slotNumber: tool.slotNumber,
        toolId: tool.toolId || tool.id,
        toolName: tool.name,
        assetNumber: tool.assetNumber,
        status: tool.status,
      }))
      .sort(
        (a, b) =>
          a.slotNumber - b.slotNumber
      );
  }, [tools]);


  // ---------------------------------------------------
  // Dashboard Statistics
  // ---------------------------------------------------
  const dashboardStats = useMemo(() => {
    const totalTools = tools.length;

    const availableTools = tools.filter(
      (tool) =>
        tool.status?.toUpperCase() === "AVAILABLE"
    ).length;

    const borrowedTools = tools.filter(
      (tool) =>
        tool.status?.toUpperCase() === "IN_USE" ||
        tool.status?.toUpperCase() === "BORROWED"
    ).length;

    const maintenanceTools = tools.filter(
      (tool) =>
        tool.status?.toUpperCase() === "MAINTENANCE"
    ).length;

    const totalCabinets = cabinets.length;

    const onlineCabinets = cabinets.filter(
      (cabinet) =>
        cabinet.status?.toUpperCase() === "ACTIVE"
    ).length;

    const offlineCabinets =
      totalCabinets - onlineCabinets;

    const activeTransactions =
      transactions.filter(
        (transaction) =>
          transaction.status?.toUpperCase() ===
          "OPEN"
      ).length;

    return {
      totalTools,
      availableTools,
      borrowedTools,
      maintenanceTools,
      totalCabinets,
      onlineCabinets,
      offlineCabinets,
      activeTransactions,
    };
  }, [tools, cabinets, transactions]);


  // ---------------------------------------------------
  // Recent Events
  // ---------------------------------------------------
  const recentEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const timeA =
          new Date(a.timestamp || 0).getTime();

        const timeB =
          new Date(b.timestamp || 0).getTime();

        return timeB - timeA;
      })
      .slice(0, 5)
      .map(mapEventToRecentEvent);
  }, [events]);

  // ---------------------------------------------------
  // Event Error
  // ---------------------------------------------------
  useEffect(() => {
    if (eventsError) {
      setError(eventsError);
    }
  }, [eventsError]);


  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------
  return (
    <div className="stc-dashboard">

      {/* ---------------------------------------------------
          Summary
      --------------------------------------------------- */}
      <section
        className="stc-dashboard__summary"
        aria-label="System summary"
      >

        <SummaryCard
          icon={Box}
          label="Total Cabinets"
          value={dashboardStats.totalCabinets}
          subtitle={`${dashboardStats.onlineCabinets} active · ${dashboardStats.offlineCabinets} inactive`}
        />

        <SummaryCard
          icon={Wrench}
          label="Tools"
          value={dashboardStats.totalTools}
          subtitle={`${dashboardStats.availableTools} available · ${dashboardStats.borrowedTools} borrowed`}
        />

        <SummaryCard
          icon={ArrowLeftRight}
          label="Active Transactions"
          value={dashboardStats.activeTransactions}
          subtitle="Currently active"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Maintenance Alerts"
          value={dashboardStats.maintenanceTools}
          subtitle="Tools requiring maintenance"
        />

      </section>


      {/* ---------------------------------------------------
          Monitoring
      --------------------------------------------------- */}
      <section className="stc-dashboard__monitoring">

        <div className="stc-dashboard__main-column">

          <CabinetStatus
            cabinets={cabinets}
            onOpenCabinet={(id) =>
              navigate(`/cabinets/${id}`)
            }
            onViewAll={() =>
              navigate("/cabinets")
            }
          />

          <CabinetVisualization
            cabinetId="CAB-DF11099F"
            slots={cabinetSlots}
          />

        </div>


        <div className="stc-dashboard__side-column">

          {/* ---------------------------------------------------
              REALTIME EVENTS
          --------------------------------------------------- */}
          <RecentEvents
            events={recentEvents}
            loading={eventsLoading}
            error={eventsError}
            onRefresh={refreshEvents}
            onViewAll={() =>
              navigate("/events")
            }
          />

          <SystemHealth />

        </div>

      </section>


      {/* ---------------------------------------------------
          Transaction Activity
      --------------------------------------------------- */}
      <section className="stc-dashboard__transaction">

        <TransactionActivity
          transactions={transactions}
          transactionItems={transactionItems}
          tools={tools}
          onViewAll={() =>
            navigate("/transactions")
          }
        />

      </section>


      {/* ---------------------------------------------------
          Analytics
      --------------------------------------------------- */}
      <section className="stc-dashboard__analytics">

        <UsageAnalytics
          data={USAGE_7D}
        />

        <ToolStatus
          tools={tools}
          onOpenTool={(id) =>
            navigate(`/tools/${id}`)
          }
          onViewAll={() =>
            navigate("/tools")
          }
        />

      </section>


      {/* ---------------------------------------------------
          Maintenance
      --------------------------------------------------- */}
      <section className="stc-dashboard__maintenance">

        <MaintenanceAlerts
          alerts={ALERTS}
          onViewAll={() =>
            navigate("/maintenance")
          }
        />

      </section>

    </div>
  );
}


export default Dashboard;
