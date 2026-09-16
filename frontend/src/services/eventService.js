const API_BASE_URL = "http://localhost:8000/api/v1";

export async function getEvents(limit = 50) {
  const response = await fetch(
    `${API_BASE_URL}/events/?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch events: ${response.status}`
    );
  }

  return response.json();
}