/**
 * Rate Limiter Utility untuk Pre-Order
 * Membatasi pengiriman pre-order per email untuk mencegah spam
 */

const RATE_LIMIT_KEY = "preorder_submissions";
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 jam dalam ms
const MAX_SUBMISSIONS_PER_DAY = 3; // Maximum 3 submissions per 24 hours per email

/**
 * Dapatkan data rate limit dari localStorage
 */
export const getRateLimitData = () => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading rate limit data:", error);
    return {};
  }
};

/**
 * Simpan data rate limit ke localStorage
 */
const setRateLimitData = (data) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving rate limit data:", error);
  }
};

/**
 * Bersihkan data rate limit yang sudah expire
 */
const cleanExpiredSubmissions = (submissions) => {
  const now = Date.now();
  const filtered = {};

  Object.entries(submissions).forEach(([email, times]) => {
    const validTimes = times.filter((time) => now - time < RATE_LIMIT_WINDOW);
    if (validTimes.length > 0) {
      filtered[email] = validTimes;
    }
  });

  return filtered;
};

/**
 * Cek apakah email bisa mengirim pre-order
 * @param {string} email - Email pelanggan
 * @returns {object} - { allowed: boolean, remaining: number, retryAfter: number }
 */
export const checkRateLimit = (email) => {
  if (!email) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: 0,
      message: "Email diperlukan untuk check rate limit",
    };
  }

  const submissions = cleanExpiredSubmissions(getRateLimitData());
  const emailSubmissions = submissions[email] || [];
  const now = Date.now();

  // Hapus submissions yang sudah expire
  const validSubmissions = emailSubmissions.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  const remaining = MAX_SUBMISSIONS_PER_DAY - validSubmissions.length;
  const allowed = remaining > 0;

  let retryAfter = 0;
  if (!allowed && validSubmissions.length > 0) {
    // Hitung berapa lama harus menunggu untuk pengiriman berikutnya
    retryAfter = Math.ceil(
      (validSubmissions[0] + RATE_LIMIT_WINDOW - now) / 1000 / 60 // dalam menit
    );
  }

  return {
    allowed,
    remaining: Math.max(0, remaining),
    retryAfter,
    message: allowed
      ? `Anda masih bisa mengirim ${remaining} pre-order dalam 24 jam`
      : `Anda sudah mencapai batas pengiriman. Silakan coba lagi dalam ${retryAfter} menit`,
  };
};

/**
 * Record pengiriman pre-order untuk email tertentu
 * @param {string} email - Email pelanggan
 */
export const recordSubmission = (email) => {
  if (!email) return false;

  try {
    const submissions = cleanExpiredSubmissions(getRateLimitData());

    if (!submissions[email]) {
      submissions[email] = [];
    }

    submissions[email].push(Date.now());
    setRateLimitData(submissions);
    return true;
  } catch (error) {
    console.error("Error recording submission:", error);
    return false;
  }
};

/**
 * Reset rate limit untuk email tertentu (untuk admin)
 * @param {string} email - Email pelanggan
 */
export const resetRateLimit = (email) => {
  if (!email) return false;

  try {
    const submissions = getRateLimitData();
    delete submissions[email];
    setRateLimitData(submissions);
    return true;
  } catch (error) {
    console.error("Error resetting rate limit:", error);
    return false;
  }
};

/**
 * Get semua rate limit submissions (untuk debugging/admin)
 */
export const getAllSubmissions = () => {
  return cleanExpiredSubmissions(getRateLimitData());
};

/**
 * Clear semua rate limit data
 */
export const clearAllRateLimits = () => {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing rate limits:", error);
    return false;
  }
};
