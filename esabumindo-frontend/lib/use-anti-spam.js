/**
 * React Hook for Anti-Spam Protection
 *
 * Usage:
 * const antiSpam = useAntiSpam({
 *   onBotDetected: (result) => console.log('Bot detected'),
 *   onRateLimited: (result) => toast.error(result.errors[0].message),
 * });
 *
 * // In form:
 * <input onChange={(e) => { antiSpam.trackInteraction(); handleChange(e); }} />
 *
 * // On submit:
 * const result = antiSpam.validate(formData);
 * if (!result.valid) { handle errors }
 *
 * // On success:
 * antiSpam.onSuccess(email);
 */

import { useEffect, useCallback, useRef } from "react";
import {
  initFormSession,
  recordInteraction,
  validateSubmission,
  handleSuccessfulSubmission,
  handleFailedSubmission,
  generateFingerprint,
} from "./anti-spam";

/**
 * Anti-spam hook options
 * @typedef {Object} UseAntiSpamOptions
 * @property {boolean} [enableDebug=false] - Enable debug logging
 * @property {function} [onBotDetected] - Callback when bot is detected
 * @property {function} [onRateLimited] - Callback when rate limited
 * @property {function} [onValidationError] - Callback for other validation errors
 */

/**
 * useAntiSpam Hook
 * @param {UseAntiSpamOptions} options
 */
export function useAntiSpam(options = {}) {
  const {
    enableDebug = false,
    onBotDetected,
    onRateLimited,
    onValidationError,
  } = options;

  const sessionRef = useRef(null);
  const fingerprintRef = useRef(null);
  const interactionCountRef = useRef(0);

  // Debug logger
  const debug = useCallback(
    (...args) => {
      if (enableDebug) {
        console.log("[AntiSpam]", ...args);
      }
    },
    [enableDebug]
  );

  // Initialize session on mount
  useEffect(() => {
    debug("Initializing anti-spam session...");
    sessionRef.current = initFormSession();
    fingerprintRef.current = generateFingerprint();
    debug("Session initialized:", {
      token: sessionRef.current?.token?.slice(0, 8) + "...",
      fingerprint: fingerprintRef.current,
    });

    return () => {
      debug("Cleaning up session");
    };
  }, [debug]);

  // Track user interaction
  const trackInteraction = useCallback(() => {
    interactionCountRef.current++;
    recordInteraction();
    debug("Interaction recorded:", interactionCountRef.current);
  }, [debug]);

  // Validate form submission
  const validate = useCallback(
    (formData) => {
      debug("Validating submission...", {
        fields: Object.keys(formData),
        interactions: interactionCountRef.current,
      });

      const result = validateSubmission(formData);

      debug("Validation result:", {
        valid: result.valid,
        errors: result.errors?.length || 0,
        warnings: result.warnings?.length || 0,
        botDetected: result.metadata?.botDetected,
      });

      // Call appropriate callbacks
      if (!result.valid) {
        // Check for bot detection
        if (result.metadata?.botDetected) {
          debug("Bot detected!");
          onBotDetected?.(result);
          return result;
        }

        // Check for rate limiting
        const rateLimitError = result.errors.find(
          (e) => e.type === "rate_limit"
        );
        if (rateLimitError) {
          debug("Rate limited:", rateLimitError.message);
          onRateLimited?.(result);
          return result;
        }

        // Other validation errors
        debug("Validation errors:", result.errors);
        onValidationError?.(result);
      }

      return result;
    },
    [debug, onBotDetected, onRateLimited, onValidationError]
  );

  // Handle successful submission
  const onSuccess = useCallback(
    (email) => {
      debug("Recording successful submission for:", email);
      handleSuccessfulSubmission(email, fingerprintRef.current);

      // Reset interaction count
      interactionCountRef.current = 0;

      // Re-initialize session for next submission
      sessionRef.current = initFormSession();
      debug("Session reset for next submission");
    },
    [debug]
  );

  // Handle failed submission
  const onFailure = useCallback(
    (email, severity = "low") => {
      debug("Recording failed submission:", { email, severity });
      handleFailedSubmission(email, fingerprintRef.current, severity);
    },
    [debug]
  );

  // Get current fingerprint
  const getFingerprint = useCallback(() => {
    return fingerprintRef.current;
  }, []);

  // Get session info (for debugging)
  const getSessionInfo = useCallback(() => {
    return {
      session: sessionRef.current,
      fingerprint: fingerprintRef.current,
      interactions: interactionCountRef.current,
    };
  }, []);

  // Check if form is ready (session initialized)
  const isReady = useCallback(() => {
    return sessionRef.current !== null;
  }, []);

  return {
    // Core functions
    trackInteraction,
    validate,
    onSuccess,
    onFailure,

    // Utility functions
    getFingerprint,
    getSessionInfo,
    isReady,
  };
}

export default useAntiSpam;
