import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  LayoutGrid,
  List,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import ToolTable from "../components/tools/ToolTable";
import ToolCard from "../components/tools/ToolCard";
import toolService from "../services/toolService";
import { subscribeToCollection } from "../services/firestoreService";

function Tools() {
  const navigate = useNavigate();

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [view, setView] =
    useState("table");

  /**
   * Load tools from API
   */
  const loadTools = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await toolService.getTools();

      setTools(data);
    } catch (err) {
      console.error(
        "Failed to load tools:",
        err
      );

      setError(
        err.message ||
          "Failed to load tools."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Firestore real-time listener
   */
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToCollection(
      "tools",
      (data) => {
        setTools(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Filter tools
   */
  const filteredTools = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch =
        !query ||
        tool.name
          ?.toLowerCase()
          .includes(query) ||
        tool.assetNumber
          ?.toLowerCase()
          .includes(query) ||
        tool.toolId
          ?.toLowerCase()
          .includes(query) ||
        tool.id
          ?.toLowerCase()
          .includes(query) ||
        tool.category
          ?.toLowerCase()
          .includes(query) ||
        tool.cabinetId
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        tool.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" ||
        tool.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    tools,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /**
   * Get categories from API data
   */
  const categories = useMemo(() => {
    return [
      ...new Set(
        tools
          .map(
            (tool) => tool.category
          )
          .filter(Boolean)
      ),
    ];
  }, [tools]);

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
            Loading tools...
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
            Failed to load tools.
          </div>

          <div className="stc-empty-state__description">
            {error}
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={loadTools}
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
              setSearch(
                event.target.value
              )
            }
            placeholder="Search tools..."
            aria-label="Search tools"
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
        >
          <option value="ALL">
            All Status
          </option>

          <option value="AVAILABLE">
            Available
          </option>

          <option value="IN_USE">
            In Use
          </option>

          <option value="MAINTENANCE">
            Maintenance
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          className="stc-select"
        >
          <option value="ALL">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
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
          {filteredTools.length} tools
        </span>
      </div>

      {filteredTools.length === 0 ? (
        <Card
          className="stc-empty-state"
          padding="lg"
        >
          <div className="stc-empty-state__title">
            No tools found.
          </div>

          <div className="stc-empty-state__description">
            There are no tools matching
            your current filter.
          </div>

          <button
            type="button"
            className="stc-panel-action"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setCategoryFilter("ALL");
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
          <ToolTable
            tools={filteredTools}
            onOpen={(id) =>
              navigate(
                `/tools/${id}`
              )
            }
          />
        </Card>
      ) : (
        <div className="stc-tool-grid">
          {filteredTools.map(
            (tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onOpen={(id) =>
                  navigate(
                    `/tools/${id}`
                  )
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Tools;