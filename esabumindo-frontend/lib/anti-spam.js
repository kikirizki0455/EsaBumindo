/**
 * Comprehensive Anti-Spam Protection System
 *
 * Features:
 * 1. Honeypot Fields - Hidden fields that only bots fill
 * 2. Time-based Validation - Detect too fast/slow submissions
 * 3. Browser Fingerprinting - Track unique devices
 * 4. Rate Limiting - Limit submissions per email/device
 * 5. Input Sanitization - Clean and validate all inputs
 * 6. Spam Pattern Detection - Detect suspicious content
 * 7. Session Token Validation - Prevent CSRF-like attacks
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
  // Timing settings (in milliseconds)
  MIN_SUBMISSION_TIME: 5000, // Minimum 5 seconds to fill form
  MAX_SUBMISSION_TIME: 3600000, // Maximum 1 hour session
  MIN_INTERACTIONS: 3, // Minimum user interactions required

  // Rate limiting
  MAX_SUBMISSIONS_PER_EMAIL: 3, // Per day
  MAX_SUBMISSIONS_PER_DEVICE: 5, // Per day
  RATE_LIMIT_WINDOW: 24 * 60 * 60 * 1000, // 24 hours
  COOLDOWN_PERIOD: 5 * 60 * 1000, // 5 minutes between submissions

  // Blocking
  MAX_FAILED_ATTEMPTS: 5, // Before temporary block
  BLOCK_DURATION: 60 * 60 * 1000, // 1 hour block

  // Storage keys
  STORAGE_KEY: "esabond_antispam",
  SESSION_KEY: "esabond_form_session",
};

// ==================== HONEYPOT FIELDS ====================
/**
 * Get honeypot field configurations
 * These fields should be hidden and remain empty
 */
export const getHoneypotFields = () => ({
  fields: [
    { name: "website", type: "text", label: "Website URL" },
    { name: "fax_number", type: "tel", label: "Fax Number" },
    { name: "address2", type: "text", label: "Address Line 2" },
  ],
  hideClass:
    "sr-only absolute -left-[9999px] opacity-0 pointer-events-none h-0 w-0 overflow-hidden",
});

/**
 * Check if honeypot fields are filled (indicates bot)
 */
const checkHoneypot = (formData) => {
  const honeypotFields = ["website", "fax_number", "address2"];

  for (const field of honeypotFields) {
    if (formData[field] && formData[field].trim() !== "") {
      return {
        isBot: true,
        field,
        value: formData[field],
      };
    }
  }

  return { isBot: false };
};

// ==================== BROWSER FINGERPRINTING ====================
/**
 * Generate a simple browser fingerprint
 * Note: This is a basic implementation. For production, consider using fingerprintjs
 */
export const generateFingerprint = () => {
  if (typeof window === "undefined") return "server";

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || "unknown",
    navigator.deviceMemory || "unknown",
    // Canvas fingerprint (simplified)
    getCanvasFingerprint(),
  ];

  return hashCode(components.join("|"));
};

/**
 * Get canvas fingerprint
 */
const getCanvasFingerprint = () => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("Esabond Security Check", 2, 2);
    return canvas.toDataURL().slice(-50);
  } catch {
    return "canvas-unavailable";
  }
};

/**
 * Simple hash function
 */
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// ==================== SESSION MANAGEMENT ====================
/**
 * Initialize form session
 */
export const initFormSession = () => {
  if (typeof window === "undefined") return null;

  const token = generateToken();
  const fingerprint = generateFingerprint();
  const startTime = Date.now();

  const session = {
    token,
    fingerprint,
    startTime,
    interactions: 0,
    lastActivity: startTime,
  };

  try {
    sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn("[AntiSpam] SessionStorage not available");
  }

  return session;
};

/**
 * Get current form session
 */
const getFormSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const data = sessionStorage.getItem(CONFIG.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Update session with interaction
 */
export const recordInteraction = () => {
  if (typeof window === "undefined") return;

  try {
    const session = getFormSession();
    if (session) {
      session.interactions++;
      session.lastActivity = Date.now();
      sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // Silently fail
  }
};

/**
 * Generate secure token
 */
const generateToken = () => {
  const array = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

// ==================== RATE LIMITING ====================
/**
 * Get anti-spam data from localStorage
 */
const getAntiSpamData = () => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

/**
 * Save anti-spam data to localStorage
 */
const saveAntiSpamData = (data) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
};

/**
 * Clean up old entries
 */
const cleanupOldEntries = (data) => {
  const now = Date.now();
  const cleaned = { ...data };

  // Clean email submissions
  if (cleaned.emails) {
    for (const email of Object.keys(cleaned.emails)) {
      cleaned.emails[email] = cleaned.emails[email].filter(
        (time) => now - time < CONFIG.RATE_LIMIT_WINDOW
      );
      if (cleaned.emails[email].length === 0) {
        delete cleaned.emails[email];
      }
    }
  }

  // Clean device submissions
  if (cleaned.devices) {
    for (const device of Object.keys(cleaned.devices)) {
      cleaned.devices[device] = cleaned.devices[device].filter(
        (time) => now - time < CONFIG.RATE_LIMIT_WINDOW
      );
      if (cleaned.devices[device].length === 0) {
        delete cleaned.devices[device];
      }
    }
  }

  // Clean expired blocks
  if (cleaned.blocked) {
    for (const key of Object.keys(cleaned.blocked)) {
      if (now > cleaned.blocked[key].until) {
        delete cleaned.blocked[key];
      }
    }
  }

  // Clean failed attempts older than block duration
  if (cleaned.failedAttempts) {
    for (const key of Object.keys(cleaned.failedAttempts)) {
      cleaned.failedAttempts[key] = cleaned.failedAttempts[key].filter(
        (time) => now - time < CONFIG.BLOCK_DURATION
      );
      if (cleaned.failedAttempts[key].length === 0) {
        delete cleaned.failedAttempts[key];
      }
    }
  }

  return cleaned;
};

/**
 * Check rate limit for email
 */
const checkEmailRateLimit = (email, data) => {
  const normalizedEmail = email.toLowerCase().trim();
  const submissions = data.emails?.[normalizedEmail] || [];
  const now = Date.now();

  // Check cooldown
  const lastSubmission = submissions[submissions.length - 1];
  if (lastSubmission && now - lastSubmission < CONFIG.COOLDOWN_PERIOD) {
    const waitMinutes = Math.ceil(
      (CONFIG.COOLDOWN_PERIOD - (now - lastSubmission)) / 60000
    );
    return {
      allowed: false,
      reason: "cooldown",
      message: `Mohon tunggu ${waitMinutes} menit sebelum mengirim pesanan lagi.`,
      remaining: 0,
      waitTime: waitMinutes,
    };
  }

  // Check daily limit
  const recentSubmissions = submissions.filter(
    (time) => now - time < CONFIG.RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= CONFIG.MAX_SUBMISSIONS_PER_EMAIL) {
    return {
      allowed: false,
      reason: "daily_limit",
      message: `Anda telah mencapai batas maksimum ${CONFIG.MAX_SUBMISSIONS_PER_EMAIL} pesanan per hari. Silakan coba lagi besok.`,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: CONFIG.MAX_SUBMISSIONS_PER_EMAIL - recentSubmissions.length,
  };
};

/**
 * Check rate limit for device
 */
const checkDeviceRateLimit = (fingerprint, data) => {
  const submissions = data.devices?.[fingerprint] || [];
  const now = Date.now();

  const recentSubmissions = submissions.filter(
    (time) => now - time < CONFIG.RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= CONFIG.MAX_SUBMISSIONS_PER_DEVICE) {
    return {
      allowed: false,
      reason: "device_limit",
      message:
        "Terlalu banyak pesanan dari perangkat ini. Silakan coba lagi besok.",
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: CONFIG.MAX_SUBMISSIONS_PER_DEVICE - recentSubmissions.length,
  };
};

/**
 * Check if email/device is blocked
 */
const checkBlocked = (email, fingerprint, data) => {
  const now = Date.now();
  const normalizedEmail = email?.toLowerCase().trim();

  // Check email block
  if (normalizedEmail && data.blocked?.[normalizedEmail]) {
    if (now < data.blocked[normalizedEmail].until) {
      const waitMinutes = Math.ceil(
        (data.blocked[normalizedEmail].until - now) / 60000
      );
      return {
        blocked: true,
        reason: data.blocked[normalizedEmail].reason,
        message: `Akses diblokir sementara karena aktivitas mencurigakan. Coba lagi dalam ${waitMinutes} menit.`,
        waitTime: waitMinutes,
      };
    }
  }

  // Check device block
  if (fingerprint && data.blocked?.[fingerprint]) {
    if (now < data.blocked[fingerprint].until) {
      const waitMinutes = Math.ceil(
        (data.blocked[fingerprint].until - now) / 60000
      );
      return {
        blocked: true,
        reason: data.blocked[fingerprint].reason,
        message: `Perangkat ini diblokir sementara. Coba lagi dalam ${waitMinutes} menit.`,
        waitTime: waitMinutes,
      };
    }
  }

  return { blocked: false };
};

// ==================== SPAM DETECTION ====================
/**
 * Spam patterns to detect
 */
const SPAM_PATTERNS = [
  // URLs in text fields
  /https?:\/\/[^\s]+/gi,
  // Multiple URLs
  /(https?:\/\/[^\s]+.*){2,}/gi,
  // Excessive special characters
  /[!@#$%^&*()]{5,}/g,
  // Common spam keywords
  /\b(viagra|cialis|casino|lottery|winner|congratulations|prize|free money|click here|buy now|limited time)\b/gi,
  // Cryptocurrency spam
  /\b(bitcoin|crypto|btc|eth|wallet|nft|airdrop)\b.*\b(free|invest|earn|profit)\b/gi,
  // Too many numbers (potential phone/card spam)
  /\d{10,}/g,
  // Repeated characters
  /(.)\1{4,}/g,
  // HTML tags
  /<[^>]+>/g,
  // SQL injection attempts
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR|AND)\b.*=)/gi,
  // Script injection
  /<script|javascript:|on\w+=/gi,
];

/**
 * Check for spam patterns in text
 */
const detectSpamPatterns = (text) => {
  if (!text || typeof text !== "string") return { isSpam: false };

  const matches = [];

  for (const pattern of SPAM_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matches.push({
        pattern: pattern.toString(),
        matches: match,
      });
    }
  }

  return {
    isSpam: matches.length > 0,
    matches,
    score: matches.length,
  };
};

/**
 * Validate email format and check for disposable emails
 */
const validateEmail = (email) => {
  if (!email) return { valid: false, reason: "Email diperlukan" };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Format email tidak valid" };
  }

  // Check for common disposable email domains
  const disposableDomains = [
    "tempmail.com",
    "throwaway.com",
    "guerrillamail.com",
    "mailinator.com",
    "temp-mail.org",
    "10minutemail.com",
    "fakeinbox.com",
    "trashmail.com",
    "yopmail.com",
    "tempail.com",
    "dispostable.com",
    "mailnesia.com",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return {
      valid: false,
      reason:
        "Email sementara tidak diperbolehkan. Gunakan email perusahaan atau pribadi.",
      isDisposable: true,
    };
  }

  return { valid: true };
};

/**
 * Validate phone number
 */
const validatePhone = (phone) => {
  if (!phone) return { valid: false, reason: "Nomor telepon diperlukan" };

  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, "");

  // Indonesian phone numbers: 10-13 digits
  if (digits.length < 10 || digits.length > 15) {
    return { valid: false, reason: "Nomor telepon harus 10-15 digit" };
  }

  // Check for repeated digits (fake numbers)
  if (/^(\d)\1+$/.test(digits)) {
    return { valid: false, reason: "Nomor telepon tidak valid" };
  }

  return { valid: true };
};

// ==================== INPUT SANITIZATION ====================
/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== "string") return "";

  return (
    str
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove potential script injections
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      // Limit length
      .slice(0, 1000)
  );
};

/**
 * Sanitize all form data
 */
const sanitizeFormData = (formData) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// ==================== MAIN VALIDATION ====================
/**
 * Comprehensive form validation
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation result
 */
export const validateSubmission = (formData) => {
  const errors = [];
  const warnings = [];
  const session = getFormSession();
  let data = getAntiSpamData();
  data = cleanupOldEntries(data);

  const fingerprint = generateFingerprint();
  const now = Date.now();

  // 1. Check honeypot
  const honeypotResult = checkHoneypot(formData);
  if (honeypotResult.isBot) {
    return {
      valid: false,
      errors: [{ type: "honeypot", message: "Validasi gagal" }],
      metadata: { botDetected: true },
    };
  }

  // 2. Validate session timing
  if (session) {
    const elapsed = now - session.startTime;

    // Too fast (likely bot)
    if (elapsed < CONFIG.MIN_SUBMISSION_TIME) {
      errors.push({
        type: "timing",
        action: "slow_down",
        message: "Form diisi terlalu cepat. Mohon periksa kembali data Anda.",
      });
    }

    // Session expired
    if (elapsed > CONFIG.MAX_SUBMISSION_TIME) {
      errors.push({
        type: "timing",
        action: "refresh",
        message: "Sesi telah berakhir. Silakan refresh halaman.",
      });
    }

    // Not enough interactions (might be automated)
    if (session.interactions < CONFIG.MIN_INTERACTIONS) {
      warnings.push({
        type: "low_interaction",
        message: "Interaksi pengguna rendah",
        interactions: session.interactions,
      });
    }
  }

  // 3. Check if blocked
  const blockResult = checkBlocked(formData.email, fingerprint, data);
  if (blockResult.blocked) {
    errors.push({
      type: "blocked",
      message: blockResult.message,
      waitTime: blockResult.waitTime,
    });
    return { valid: false, errors, warnings };
  }

  // 4. Check rate limits
  if (formData.email) {
    const emailRateLimit = checkEmailRateLimit(formData.email, data);
    if (!emailRateLimit.allowed) {
      errors.push({
        type: "rate_limit",
        message: emailRateLimit.message,
        reason: emailRateLimit.reason,
        waitTime: emailRateLimit.waitTime,
      });
    }
  }

  const deviceRateLimit = checkDeviceRateLimit(fingerprint, data);
  if (!deviceRateLimit.allowed) {
    errors.push({
      type: "rate_limit",
      message: deviceRateLimit.message,
      reason: deviceRateLimit.reason,
    });
  }

  // 5. Validate email
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      errors.push({
        type: "validation",
        field: "email",
        message: emailValidation.reason,
      });
    }
    if (emailValidation.isDisposable) {
      warnings.push({
        type: "disposable_email",
        message: "Email disposable detected",
      });
    }
  }

  // 6. Validate phone
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      errors.push({
        type: "validation",
        field: "phone",
        message: phoneValidation.reason,
      });
    }
  }

  // 7. Check for spam patterns
  const fieldsToCheck = ["fullName", "company", "industri", "message"];
  for (const field of fieldsToCheck) {
    if (formData[field]) {
      const spamCheck = detectSpamPatterns(formData[field]);
      if (spamCheck.isSpam) {
        if (spamCheck.score >= 2) {
          errors.push({
            type: "spam",
            field,
            message: "Konten terdeteksi sebagai spam",
          });
        } else {
          warnings.push({
            type: "suspicious_content",
            field,
            score: spamCheck.score,
          });
        }
      }
    }
  }

  // 8. Sanitize data
  const sanitizedData = sanitizeFormData(formData);

  // Return result
  const isValid = errors.length === 0;

  return {
    valid: isValid,
    errors,
    warnings,
    sanitizedData,
    metadata: {
      fingerprint,
      token: session?.token,
      timing: {
        elapsed: session ? now - session.startTime : null,
        interactions: session?.interactions || 0,
      },
      botDetected: false,
    },
  };
};

// ==================== SUBMISSION RECORDING ====================
/**
 * Record successful submission
 */
export const handleSuccessfulSubmission = (email, fingerprint) => {
  if (typeof window === "undefined") return;

  let data = getAntiSpamData();
  data = cleanupOldEntries(data);

  const now = Date.now();
  const normalizedEmail = email?.toLowerCase().trim();

  // Record email submission
  if (normalizedEmail) {
    if (!data.emails) data.emails = {};
    if (!data.emails[normalizedEmail]) data.emails[normalizedEmail] = [];
    data.emails[normalizedEmail].push(now);
  }

  // Record device submission
  if (fingerprint) {
    if (!data.devices) data.devices = {};
    if (!data.devices[fingerprint]) data.devices[fingerprint] = [];
    data.devices[fingerprint].push(now);
  }

  // Clear failed attempts on success
  if (normalizedEmail && data.failedAttempts?.[normalizedEmail]) {
    delete data.failedAttempts[normalizedEmail];
  }
  if (fingerprint && data.failedAttempts?.[fingerprint]) {
    delete data.failedAttempts[fingerprint];
  }

  saveAntiSpamData(data);

  // Clear session
  try {
    sessionStorage.removeItem(CONFIG.SESSION_KEY);
  } catch {
    // Ignore
  }
};

/**
 * Record failed/suspicious submission attempt
 */
export const handleFailedSubmission = (
  email,
  fingerprint,
  severity = "low"
) => {
  if (typeof window === "undefined") return;

  let data = getAntiSpamData();
  data = cleanupOldEntries(data);

  const now = Date.now();
  const normalizedEmail = email?.toLowerCase().trim();

  if (!data.failedAttempts) data.failedAttempts = {};

  // Record failed attempt for email
  if (normalizedEmail) {
    if (!data.failedAttempts[normalizedEmail]) {
      data.failedAttempts[normalizedEmail] = [];
    }
    data.failedAttempts[normalizedEmail].push(now);

    // Block if too many failed attempts
    if (
      data.failedAttempts[normalizedEmail].length >= CONFIG.MAX_FAILED_ATTEMPTS
    ) {
      if (!data.blocked) data.blocked = {};
      data.blocked[normalizedEmail] = {
        until: now + CONFIG.BLOCK_DURATION,
        reason: "too_many_failed_attempts",
      };
    }
  }

  // For high severity, also track device
  if (severity === "high" && fingerprint) {
    if (!data.failedAttempts[fingerprint]) {
      data.failedAttempts[fingerprint] = [];
    }
    data.failedAttempts[fingerprint].push(now);

    if (data.failedAttempts[fingerprint].length >= CONFIG.MAX_FAILED_ATTEMPTS) {
      if (!data.blocked) data.blocked = {};
      data.blocked[fingerprint] = {
        until: now + CONFIG.BLOCK_DURATION,
        reason: "suspicious_device_activity",
      };
    }
  }

  saveAntiSpamData(data);
};

// ==================== EXPORTS ====================
export default {
  initFormSession,
  recordInteraction,
  validateSubmission,
  handleSuccessfulSubmission,
  handleFailedSubmission,
  getHoneypotFields,
  generateFingerprint,
  CONFIG,
};
