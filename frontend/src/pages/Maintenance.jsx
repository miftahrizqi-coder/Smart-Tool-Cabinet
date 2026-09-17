import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card.jsx";

import MaintenanceTable from "../components/maintenance/MaintenanceTable.jsx";
import MaintenanceCard from "../components/maintenance/MaintenanceCard.jsx";

import {
  maintenanceRecords,
} from "../utils/maintenanceMockData.jsx";

function Maintenance() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const filteredRecords = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return maintenanceRecords.filter(
      (record) => {
        const matchesSearch =
          !keyword ||
          record.id
            .toLowerCase()
            .includes(keyword) ||
          record.toolName
            .toLowerCase()
            .includes(keyword) ||
          record.assetNumber
            .toLowerCase()
            .includes(keyword) ||
          record.cabinetId
            .toLowerCase()
            .includes(keyword) ||
          record.issue
            .toLowerCase()
            .includes(keyword);

        const matchesStatus =
          statusFilter === "ALL" ||
          record.status === statusFilter;

        const matchesPriority =
          priorityFilter === "ALL" ||
          record.priority === priorityFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );
      }
    );
  }, [
    search,
    statusFilter,
    priorityFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  };

  return (
    <div className="page maintenance-page">
      <div className="page-header">
        <div>
          <h1>Maintenance</h1>

          <p>
            Monitor tool maintenance and
            inspection activities.
          </p>
        </div>
      </div>

      <Card>
        <div className="maintenance-toolbar">
          <div className="maintenance-search">
            <input
              type="search"
              placeholder="Search maintenance..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search maintenance"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            aria-label="Filter maintenance status"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(
                event.target.value
              )
            }
            aria-label="Filter maintenance priority"
          >
            <option value="ALL">
              All Priority
            </option>

            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="CRITICAL">
              Critical
            </option>
          </select>
        </div>

        <div className="maintenance-result-info">
          {filteredRecords.length} maintenance
          {filteredRecords.length !== 1
            ? " records"
            : " record"}
        </div>

        {filteredRecords.length > 0 ? (
          <>
            <div className="maintenance-table-view">
              <MaintenanceTable
                records={filteredRecords}
                onOpenMaintenance={(id) =>
                  navigate(
                    `/maintenance/${id}`
                  )
                }
              />
            </div>

            <div className="maintenance-card-view">
              {filteredRecords.map(
                (record) => (
                  <MaintenanceCard
                    key={record.id}
                    record={record}
                    onOpen={(id) =>
                      navigate(
                        `/maintenance/${id}`
                      )
                    }
                  />
                )
              )}
            </div>
          </>
        ) : (
          <div className="maintenance-empty">
            <h3>
              No maintenance records found
            </h3>

            <p>
              No maintenance records match
              the current search or filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filter
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Maintenance;