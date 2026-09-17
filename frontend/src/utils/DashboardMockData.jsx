export const DASHBOARD_SUMMARY = {
  cabinets: {
    value: 12,
    subtitle: "10 online · 2 offline",
  },

  tools: {
    value: 128,
    subtitle: "116 available · 12 borrowed",
  },

  transactions: {
    value: 7,
    subtitle: "Currently active",
  },

  maintenance: {
    value: 4,
    subtitle: "2 critical · 2 warning",
  },
};

export const CABINETS = [
  {
    id: "CAB-DF11099F",
    label: "CAB-001",
    location: "Production Floor A",
    status: "ONLINE",
    door: "CLOSED",
    tools: "18 / 20",
    lastActivity: "2 min ago",
  },
  {
    id: "CAB-002",
    label: "CAB-002",
    location: "Assembly Area",
    status: "ONLINE",
    door: "CLOSED",
    tools: "24 / 26",
    lastActivity: "6 min ago",
  },
  {
    id: "CAB-003",
    label: "CAB-003",
    location: "Maintenance Room",
    status: "OFFLINE",
    door: "UNKNOWN",
    tools: "— / 18",
    lastActivity: "1 hr ago",
  },
  {
    id: "CAB-004",
    label: "CAB-004",
    location: "Warehouse",
    status: "ONLINE",
    door: "OPEN",
    tools: "31 / 32",
    lastActivity: "just now",
  },
];

export const TOOLS = [
  {
    asset: "TOOL-280F7D0F",
    name: "Impact Driver",
    category: "Power Tool",
    cabinet: "CAB-DF11099F",
    slot: "01",
    status: "Borrowed",
    usage: 94,
  },
  {
    asset: "TOOL-8A2D11BC",
    name: "Multimeter",
    category: "Measurement",
    cabinet: "CAB-DF11099F",
    slot: "03",
    status: "Available",
    usage: 88,
  },
  {
    asset: "TOOL-1F73A6D2",
    name: "Hammer",
    category: "Hand Tool",
    cabinet: "CAB-DF11099F",
    slot: "02",
    status: "Available",
    usage: 61,
  },
];

export const SLOTS = [
  {
    slot: "01",
    tool: "Impact Driver",
    status: "OCCUPIED",
  },
  {
    slot: "02",
    tool: "Hammer",
    status: "EMPTY",
  },
  {
    slot: "03",
    tool: "Multimeter",
    status: "OCCUPIED",
  },
  {
    slot: "04",
    tool: "Adjustable Wrench",
    status: "OCCUPIED",
  },
  {
    slot: "05",
    tool: "Pliers",
    status: "EMPTY",
  },
  {
    slot: "06",
    tool: "Drill",
    status: "OCCUPIED",
  },
];

export const TRANSACTIONS = [
  {
    id: "TX-10081",
    emp: "EMP-7BFA5C2B",
    tool: "Impact Driver",
    cabinet: "CAB-DF11099F",
    op: "BORROW",
    time: "2 min ago",
    status: "Active",
  },
  {
    id: "TX-10080",
    emp: "EMP-92A14C6D",
    tool: "Multimeter",
    cabinet: "CAB-002",
    op: "RETURN",
    time: "8 min ago",
    status: "Completed",
  },
  {
    id: "TX-10079",
    emp: "EMP-7BFA5C2B",
    tool: "Hammer",
    cabinet: "CAB-DF11099F",
    op: "BORROW",
    time: "12 min ago",
    status: "Active",
  },
];

export const EVENTS = [
  {
    icon: "rfid",
    title: "RFID Card Tapped",
    desc: "Employee EMP-7BFA5C2B authenticated",
    time: "2 min ago",
  },
  {
    icon: "pin",
    title: "PIN Authentication",
    desc: "PIN verified successfully",
    time: "3 min ago",
  },
  {
    icon: "borrow",
    title: "Tool Borrowed",
    desc: "Impact Driver — Slot 01",
    time: "5 min ago",
  },
  {
    icon: "return",
    title: "Tool Returned",
    desc: "Impact Driver — Slot 01",
    time: "12 min ago",
  },
  {
    icon: "conn",
    title: "Cabinet Connected",
    desc: "CAB-DF11099F is online",
    time: "18 min ago",
  },
];

export const USAGE_7D = [
  { day: "Mon", count: 14 },
  { day: "Tue", count: 19 },
  { day: "Wed", count: 11 },
  { day: "Thu", count: 22 },
  { day: "Fri", count: 27 },
  { day: "Sat", count: 9 },
  { day: "Sun", count: 6 },
];

export const ALERTS = [
  {
    severity: "Critical",
    tool: "Impact Driver",
    desc: "Usage reached maintenance threshold.",
    usage: 94,
    threshold: 100,
  },
  {
    severity: "Warning",
    tool: "Multimeter",
    desc: "Inspection due in 3 days.",
    usage: 88,
    threshold: 100,
  },
  {
    severity: "Info",
    tool: "Hammer",
    desc: "Usage approaching maintenance threshold.",
    usage: 61,
    threshold: 150,
  },
];