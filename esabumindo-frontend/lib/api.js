export async function apiFetch(url, options = {}) {
  const res = await fetch(`http://localhost:3001${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  //global auth error
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return res;
}
