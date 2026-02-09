const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function apiFetch(url, options = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
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
