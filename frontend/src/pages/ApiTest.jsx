import { useEffect, useState } from "react";
import toolService from "../services/toolService";

function ApiTest() {
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState(null);

  async function testCreateTool() {
    try {
      setStatus("Creating tool...");
      setError(null);

      const data = await toolService.createTool({
        assetNumber: "AST-TEST-001",
        name: "Test Tool",
        category: "Hand Tool",
        cabinetId: "CAB-89B7FC1C",
        slotNumber: 6,
        maintenanceThreshold: 200,
        maintenanceWarningThreshold: 180,
      });

      console.log("Create Tool response:", data);

      setStatus("Create Tool Success");
    } catch (err) {
      console.error("Create Tool error:", err);

      setStatus("Create Tool Failed");
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1>Tool API Test</h1>

      <p>{status}</p>

      {error && <p>Error: {error}</p>}

      <button onClick={testCreateTool}>
        Test Create Tool
      </button>
    </div>
  );
}

export default ApiTest;