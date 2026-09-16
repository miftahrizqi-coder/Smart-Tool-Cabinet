import React, { useEffect, useState } from "react";

import { subscribeToCollection } from "../services/firestoreService";

function FirestoreTest() {
  const [tools, setTools] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "tools",
      (data) => {
        console.log("Firestore tools:", data);
        setTools(data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Firestore Real-time Test</h1>

      {error && <p>{error}</p>}

      <p>
        Tools detected: {tools.length}
      </p>

      <pre>
        {JSON.stringify(tools, null, 2)}
      </pre>
    </div>
  );
}

export default FirestoreTest;