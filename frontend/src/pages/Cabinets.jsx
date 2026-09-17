import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import CabinetCard from "../components/cabinets/CabinetCard";
import CabinetTable from "../components/cabinets/CabinetTable";
import { subscribeToCollection } from "../services/firestoreService";
import cabinetService from "../services/cabinetService";

function Cabinets() {
  const navigate = useNavigate();

  const [cabinets, setCabinets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [view, setView] = useState("table");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toolCounts, setToolCounts] = useState({});

 const fetchCabinets = async () => {
  setLoading(true);
  setError("");

  try {
    const data = await cabinetService.getCabinets();
    const cabinetList = Array.isArray(data) ? data : [];

    setCabinets(cabinetList);
    } catch (err) {
      setError(err.message || "Failed to load cabinets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    const unsubscribe = subscribeToCollection(
      "cabinets",
      (data) => {
        setCabinets(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "tools",
      (tools) => {
        const counts = {};

        tools.forEach((tool) => {
          if (!tool.cabinetId) return;

          counts[tool.cabinetId] =
            (counts[tool.cabinetId] || 0) + 1;
        });

        setToolCounts(counts);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredCabinets = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return cabinets.filter((cabinet) => {
      const cabinetId =
        cabinet.cabinetId || "";

      const name =
        cabinet.name || "";

      const location =
        cabinet.location || "";

      const status =
        cabinet.status?.toUpperCase() || "";

      const matchesSearch =
        !query ||
        cabinetId
          .toLowerCase()
          .includes(query) ||
        name
          .toLowerCase()
          .includes(query) ||
        location
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    cabinets,
    search,
    statusFilter,
  ]);

  if (loading) {
    return (
      <div className="stc-page">
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            Loading cabinets...
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
            Failed to load cabinets.
          </div>

          <div className="stc-empty-state__description">
            {error}
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={fetchCabinets}
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="stc-page">
      <div className="stc-page-toolbar">
        <div className="stc-page-toolbar__search">
          <Search size={14} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search cabinets..."
            aria-label="Search cabinets"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="stc-select"
          aria-label="Filter cabinet status"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

        <div className="stc-view-toggle">
          <button
            type="button"
            className={
              view === "table"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("table")
            }
            aria-label="Table view"
          >
            <List size={15} />
          </button>

          <button
            type="button"
            className={
              view === "grid"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("grid")
            }
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      <div className="stc-page-result-info">
        <span>
          {filteredCabinets.length} cabinets
        </span>

        {search && (
          <span>
            Search: "{search}"
          </span>
        )}
      </div>

      {filteredCabinets.length === 0 ? (
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            No cabinets found.
          </div>

          <div className="stc-empty-state__description">
            There are no cabinets matching
            your current filter.
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Clear Filter
          </button>
        </Card>
      ) : view === "table" ? (
        <Card
          className="stc-dashboard-panel"
          padding="none"
        >
          <CabinetTable
            cabinets={filteredCabinets}
            toolCounts={toolCounts}
            onOpen={(cabinetId) => navigate(`/cabinets/${cabinetId}`)}
          />
        </Card>
      ) : (
        <div className="stc-cabinet-grid">
          {filteredCabinets.map(
            (cabinet) => (
             <CabinetCard
              cabinet={cabinet}
              toolCount={toolCounts[cabinet.cabinetId] ?? 0}
              onOpen={(cabinetId) => navigate(`/cabinets/${cabinetId}`)}
            />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Cabinets;