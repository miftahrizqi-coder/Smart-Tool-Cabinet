import { useEffect, useState } from "react";

import {
  subscribeToEvents,
} from "../services/firestoreService";


function useEvents(limit = 50) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToEvents(
      (data) => {
        setEvents(data);
        setLoading(false);
      },
      limit
    );

    return () => {
      unsubscribe();
    };
  }, [limit]);

  return {
    events,
    loading,
    error,
  };
}

export default useEvents;