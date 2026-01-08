export async function apiFetch(url, options = {}) {
  return fetch(`http://localhost:3001${url}`, {
    credentials: "include", // ← WAJIB
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}
