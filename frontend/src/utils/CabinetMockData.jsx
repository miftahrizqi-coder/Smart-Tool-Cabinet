export const CABINETS = [
  {
    id: "CAB-DF11099F",
    label: "CAB-001",
    location: "Production Floor A",
    status: "ONLINE",
    door: "CLOSED",
    ipAddress: "10.10.1.101",
    firmware: "v1.2.4",
    lastActivity: "2 min ago",
    lastSeen: "2 min ago",
    toolCount: 18,
    slotCount: 20,
    activeTransactions: 1,
  },

  {
    id: "CAB-002",
    label: "CAB-002",
    location: "Assembly Area",
    status: "ONLINE",
    door: "CLOSED",
    ipAddress: "10.10.1.102",
    firmware: "v1.2.4",
    lastActivity: "6 min ago",
    lastSeen: "6 min ago",
    toolCount: 24,
    slotCount: 26,
    activeTransactions: 0,
  },

  {
    id: "CAB-003",
    label: "CAB-003",
    location: "Maintenance Room",
    status: "OFFLINE",
    door: "UNKNOWN",
    ipAddress: "10.10.1.103",
    firmware: "v1.2.2",
    lastActivity: "1 hr ago",
    lastSeen: "1 hr ago",
    toolCount: 0,
    slotCount: 18,
    activeTransactions: 0,
  },

  {
    id: "CAB-004",
    label: "CAB-004",
    location: "Warehouse",
    status: "ONLINE",
    door: "OPEN",
    ipAddress: "10.10.1.104",
    firmware: "v1.2.4",
    lastActivity: "just now",
    lastSeen: "just now",
    toolCount: 31,
    slotCount: 32,
    activeTransactions: 1,
  },
];

export const CABINET_SLOTS = {
  "CAB-DF11099F": [
    {
      slot: "01",
      tool: "Impact Driver",
      asset: "TOOL-280F7D0F",
      status: "OCCUPIED",
    },
    {
      slot: "02",
      tool: "Hammer",
      asset: "TOOL-118A2C41",
      status: "EMPTY",
    },
    {
      slot: "03",
      tool: "Multimeter",
      asset: "TOOL-9E30B7D2",
      status: "OCCUPIED",
    },
    {
      slot: "04",
      tool: "Adjustable Wrench",
      asset: "TOOL-4C7712AA",
      status: "OCCUPIED",
    },
    {
      slot: "05",
      tool: "Pliers",
      asset: "TOOL-5591D0F3",
      status: "EMPTY",
    },
    {
      slot: "06",
      tool: "Drill",
      asset: "TOOL-A22F60E9",
      status: "OCCUPIED",
    },
  ],

  "CAB-002": [
    {
      slot: "01",
      tool: "Torque Wrench",
      asset: "TOOL-002001",
      status: "OCCUPIED",
    },
    {
      slot: "02",
      tool: "Screwdriver",
      asset: "TOOL-002002",
      status: "OCCUPIED",
    },
    {
      slot: "03",
      tool: "Pliers",
      asset: "TOOL-002003",
      status: "OCCUPIED",
    },
    {
      slot: "04",
      tool: "Drill",
      asset: "TOOL-002004",
      status: "EMPTY",
    },
    {
      slot: "05",
      tool: "Hammer",
      asset: "TOOL-002005",
      status: "OCCUPIED",
    },
    {
      slot: "06",
      tool: "Multimeter",
      asset: "TOOL-002006",
      status: "OCCUPIED",
    },
  ],

  "CAB-003": [],

  "CAB-004": [
    {
      slot: "01",
      tool: "Impact Driver",
      asset: "TOOL-004001",
      status: "OCCUPIED",
    },
    {
      slot: "02",
      tool: "Drill",
      asset: "TOOL-004002",
      status: "OCCUPIED",
    },
    {
      slot: "03",
      tool: "Hammer",
      asset: "TOOL-004003",
      status: "OCCUPIED",
    },
    {
      slot: "04",
      tool: "Pliers",
      asset: "TOOL-004004",
      status: "OCCUPIED",
    },
    {
      slot: "05",
      tool: "Wrench",
      asset: "TOOL-004005",
      status: "OCCUPIED",
    },
    {
      slot: "06",
      tool: "Multimeter",
      asset: "TOOL-004006",
      status: "OCCUPIED",
    },
  ],
};

export function getCabinetById(id) {
  return CABINETS.find(
    (cabinet) => cabinet.id === id
  );
}

export function getCabinetSlots(id) {
  return CABINET_SLOTS[id] || [];
}