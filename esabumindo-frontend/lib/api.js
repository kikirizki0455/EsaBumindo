export async function apiFetch(url, options = {}) {
  const res = await fetch(`http://localhost:3001/api${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login";
  }

  return res;
}
