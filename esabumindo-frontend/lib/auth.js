// lib/auth.js
/**
 * Get current user data from localStorage
 * Expected format: { id, email, name, role }
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return null;

    const userData = JSON.parse(userDataString);
    return userData;
  } catch (error) {
    return null;
  }
};

/**
 * Get current user's name (for author field)
 */
export const getCurrentUserName = () => {
  const user = getCurrentUser();
  return user?.name || "Admin";
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
};

/**
 * Get auth token
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

/**
 * Set auth token and user data
 */
export const setAuthData = (token, userData) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("authToken", token);
  }
  if (userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
};

/**
 * Logout user
 */
export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("userData");
  localStorage.removeItem("authToken");
  window.location.href = "/login";
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("userData");
  localStorage.removeItem("authToken");
};
