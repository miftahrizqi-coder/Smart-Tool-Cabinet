export const maintenanceRecords = [
  {
    id: "MNT-20260906-001",

    toolId: "AST-005",
    toolName: "Pliers",
    assetNumber: "AST-005",

    cabinetId: "CAB-001",
    slotNumber: 5,

    issue: "Usage threshold reached",
    description:
      "Tool usage has reached the configured maintenance threshold.",

    priority: "CRITICAL",
    status: "PENDING",

    usageCount: 196,
    maintenanceThreshold: 200,

    reportedAt: "Today, 08:35",
    startedAt: null,
    completedAt: null,

    technician: null,
  },

  {
    id: "MNT-20260905-004",

    toolId: "AST-001",
    toolName: "Impact Driver",
    assetNumber: "AST-001",

    cabinetId: "CAB-001",
    slotNumber: 1,

    issue: "High usage",
    description:
      "Tool has experienced high usage and requires inspection.",

    priority: "HIGH",
    status: "IN_PROGRESS",

    usageCount: 142,
    maintenanceThreshold: 200,

    reportedAt: "Yesterday, 16:20",
    startedAt: "Today, 07:15",
    completedAt: null,

    technician: "Maintenance Team",
  },

  {
    id: "MNT-20260903-002",

    toolId: "AST-003",
    toolName: "Multimeter",
    assetNumber: "AST-003",

    cabinetId: "CAB-001",
    slotNumber: 3,

    issue: "Calibration inspection",
    description:
      "Periodic calibration inspection completed.",

    priority: "MEDIUM",
    status: "COMPLETED",

    usageCount: 64,
    maintenanceThreshold: 150,

    reportedAt: "Sep 3, 09:10",
    startedAt: "Sep 3, 10:00",
    completedAt: "Sep 3, 11:20",

    technician: "Andi Pratama",
  },

  {
    id: "MNT-20260902-006",

    toolId: "AST-008",
    toolName: "Impact Driver",
    assetNumber: "AST-008",

    cabinetId: "CAB-004",
    slotNumber: 1,

    issue: "Abnormal usage pattern",
    description:
      "Usage pattern requires manual inspection.",

    priority: "HIGH",
    status: "PENDING",

    usageCount: 178,
    maintenanceThreshold: 200,

    reportedAt: "Sep 2, 14:45",
    startedAt: null,
    completedAt: null,

    technician: null,
  },
];

export const getMaintenanceById = (id) => {
  return maintenanceRecords.find(
    (record) => record.id === id
  );
};