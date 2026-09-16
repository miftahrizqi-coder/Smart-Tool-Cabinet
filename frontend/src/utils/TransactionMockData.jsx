export const transactions = [
  {
    id: "TRX-20260906-001",
    employeeId: "EMP-7BFA5C2B",
    employeeName: "Rendy",
    cabinetId: "CAB-001",
    status: "ACTIVE",
    startTime: "Today, 09:42",
    endTime: null,

    items: [
      {
        toolId: "AST-001",
        toolName: "Impact Driver",
        assetNumber: "AST-001",
        slotNumber: 1,
        takenAt: "Today, 09:42",
        returnedAt: null,
      },
    ],
  },

  {
    id: "TRX-20260906-002",
    employeeId: "EMP-9C42E7F1",
    employeeName: "Dimas",
    cabinetId: "CAB-001",
    status: "ACTIVE",
    startTime: "Today, 09:15",
    endTime: null,

    items: [
      {
        toolId: "AST-003",
        toolName: "Multimeter",
        assetNumber: "AST-003",
        slotNumber: 3,
        takenAt: "Today, 09:15",
        returnedAt: null,
      },
      {
        toolId: "AST-005",
        toolName: "Pliers",
        assetNumber: "AST-005",
        slotNumber: 5,
        takenAt: "Today, 09:17",
        returnedAt: null,
      },
    ],
  },

  {
    id: "TRX-20260905-014",
    employeeId: "EMP-4A91C8D3",
    employeeName: "Andi Pratama",
    cabinetId: "CAB-001",
    status: "COMPLETED",
    startTime: "Yesterday, 13:20",
    endTime: "Yesterday, 15:48",

    items: [
      {
        toolId: "AST-004",
        toolName: "Adjustable Wrench",
        assetNumber: "AST-004",
        slotNumber: 4,
        takenAt: "Yesterday, 13:20",
        returnedAt: "Yesterday, 15:48",
      },
    ],
  },

  {
    id: "TRX-20260905-013",
    employeeId: "EMP-6E31A9C5",
    employeeName: "Rizky",
    cabinetId: "CAB-002",
    status: "COMPLETED",
    startTime: "Yesterday, 10:12",
    endTime: "Yesterday, 11:36",

    items: [
      {
        toolId: "AST-006",
        toolName: "Drill",
        assetNumber: "AST-006",
        slotNumber: 4,
        takenAt: "Yesterday, 10:12",
        returnedAt: "Yesterday, 11:36",
      },
    ],
  },

  {
    id: "TRX-20260904-009",
    employeeId: "EMP-2D8A61B4",
    employeeName: "Fajar",
    cabinetId: "CAB-002",
    status: "CANCELLED",
    startTime: "Sep 4, 14:05",
    endTime: "Sep 4, 14:07",

    items: [
      {
        toolId: "AST-007",
        toolName: "Torque Wrench",
        assetNumber: "AST-007",
        slotNumber: 1,
        takenAt: "Sep 4, 14:05",
        returnedAt: "Sep 4, 14:07",
      },
    ],
  },
];

export const getTransactionById = (id) => {
  return transactions.find(
    (transaction) => transaction.id === id
  );
};