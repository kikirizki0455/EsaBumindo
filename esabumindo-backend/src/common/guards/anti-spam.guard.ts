// filepath: d:\esabond\esabond_web\esabumindo-backend\src\common\guards\anti-spam.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface SpamScore {
  score: number;
  reasons: string[];
}

@Injectable()
export class AntiSpamGuard implements CanActivate {
  // Rate limiting storage
  private ipRateLimits: Map<string, RateLimitEntry> = new Map();
  private fingerprintRateLimits: Map<string, RateLimitEntry> = new Map();
  private blockedIPs: Set<string> = new Set();

  // Configuration
  private readonly CONFIG = {
    // Rate limiting
    MAX_REQUESTS_PER_IP: 10, // per window
    MAX_REQUESTS_PER_FINGERPRINT: 15,
    RATE_LIMIT_WINDOW: 60 * 60 * 1000, // 1 hour
    MIN_REQUEST_INTERVAL: 5000, // 5 seconds between requests

    // Blocking
    BLOCK_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    SPAM_SCORE_THRESHOLD: 50,

    // Timing validation
    MIN_FORM_TIME: 3000, // 3 seconds minimum
    MAX_FORM_TIME: 2 * 60 * 60 * 1000, // 2 hours maximum
  };

  // Known spam patterns
  private readonly SPAM_PATTERNS = {
    emails: [
      /test@test\.(com|net|org)/i,
      /spam@/i,
      /noreply@/i,
      /^[a-z]{1,2}@/i, // Very short local part
      /@(mailinator|guerrillamail|tempmail|throwaway)/i,
    ],
    names: [
      /^(test|asdf|qwerty|admin|root|user\d*)$/i,
      /^[a-z]{1,2}$/i, // Very short names
      /(.)\1{4,}/i, // Repeated characters (aaaaa)
    ],
    phones: [
      /^0{5,}/,
      /^1234567/,
      /^(.)\1{6,}$/, // All same digit
    ],
    messages: [
      /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
      /\b(click here|buy now|act now|limited time)\b/i,
      /(http|https|www\.)[^\s]+/gi, // URLs in message
      /(.)\1{10,}/i, // Excessive repeated chars
    ],
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract client info
    const clientIP = this.getClientIP(request);
    const fingerprint = this.getFingerprint(request);
    const securityData = this.getSecurityData(request);

    console.log(
      `[AntiSpam] Request from IP: ${clientIP}, Fingerprint: ${fingerprint}`,
    );

    // 1. Check if IP is blocked
    if (this.blockedIPs.has(clientIP)) {
      this.logSpamAttempt(clientIP, 'Blocked IP attempted access');
      throw new HttpException(
        {
          success: false,
          message: 'Akses ditolak. Silakan coba lagi nanti.',
          code: 'BLOCKED',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 2. Check IP rate limit
    this.checkRateLimit(clientIP, this.ipRateLimits, 'IP');

    // 3. Check fingerprint rate limit
    if (fingerprint) {
      this.checkRateLimit(
        fingerprint,
        this.fingerprintRateLimits,
        'Fingerprint',
      );
    }

    // 4. Validate honeypot fields
    this.validateHoneypot(request.body);

    // 5. Validate timing
    this.validateTiming(securityData);

    // 6. Calculate spam score
    const spamScore = this.calculateSpamScore(request.body, securityData);
    if (spamScore.score >= this.CONFIG.SPAM_SCORE_THRESHOLD) {
      this.logSpamAttempt(
        clientIP,
        `High spam score: ${spamScore.score}`,
        spamScore.reasons,
      );

      // Block IP if spam score is very high
      if (spamScore.score >= 80) {
        this.blockedIPs.add(clientIP);
      }

      throw new HttpException(
        {
          success: false,
          message: 'Permintaan tidak dapat diproses. Silakan coba lagi.',
          code: 'SPAM_DETECTED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 7. Validate request signature (if provided)
    if (securityData.signature) {
      this.validateSignature(securityData, request.body);
    }

    // Attach security info to request for logging
    (request as any).securityInfo = {
      clientIP,
      fingerprint,
      spamScore: spamScore.score,
    };

    return true;
  }

  /**
   * Get client IP from request
   */
  private getClientIP(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = (
        typeof forwarded === 'string' ? forwarded : forwarded[0]
      ).split(',');
      return ips[0].trim();
    }
    return (request.headers['x-real-ip'] as string) || request.ip || 'unknown';
  }

  /**
   * Get fingerprint from request headers
   */
  private getFingerprint(request: Request): string | null {
    return (request.headers['x-fingerprint'] as string) || null;
  }

  /**
   * Get security data from request headers
   */
  private getSecurityData(request: Request): any {
    return {
      token: request.headers['x-form-token'] as string,
      fingerprint: request.headers['x-fingerprint'] as string,
      timestamp: request.headers['x-form-timestamp'] as string,
      signature: request.headers['x-request-signature'] as string,
      formStartTime: parseInt(request.headers['x-form-start'] as string) || 0,
    };
  }

  /**
   * Check rate limit for a key
   */
  private checkRateLimit(
    key: string,
    storage: Map<string, RateLimitEntry>,
    type: string,
  ): void {
    const now = Date.now();
    const entry = storage.get(key);

    if (!entry) {
      storage.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
        blocked: false,
      });
      return;
    }

    // Check if blocked
    if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
      const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
      throw new HttpException(
        {
          success: false,
          message: `Terlalu banyak permintaan. Coba lagi dalam ${remainingMinutes} menit.`,
          code: 'RATE_LIMITED',
          retryAfter: remainingMinutes,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Reset if window expired
    if (now - entry.firstRequest > this.CONFIG.RATE_LIMIT_WINDOW) {
      storage.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
        blocked: false,
      });
      return;
    }

    // Check minimum interval
    if (now - entry.lastRequest < this.CONFIG.MIN_REQUEST_INTERVAL) {
      throw new HttpException(
        {
          success: false,
          message: 'Mohon tunggu beberapa detik sebelum mengirim lagi.',
          code: 'TOO_FAST',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check max requests
    const maxRequests =
      type === 'IP'
        ? this.CONFIG.MAX_REQUESTS_PER_IP
        : this.CONFIG.MAX_REQUESTS_PER_FINGERPRINT;

    if (entry.count >= maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + this.CONFIG.BLOCK_DURATION;
      storage.set(key, entry);

      throw new HttpException(
        {
          success: false,
          message: 'Terlalu banyak permintaan. Silakan coba lagi besok.',
          code: 'RATE_LIMITED',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Update count
    entry.count++;
    entry.lastRequest = now;
    storage.set(key, entry);
  }

  /**
   * Validate honeypot fields
   */
  private validateHoneypot(body: any): void {
    const honeypotFields = ['website', 'fax_number', 'address2', 'company_url'];

    for (const field of honeypotFields) {
      if (body[field] && body[field].toString().trim() !== '') {
        console.log(`[AntiSpam] Honeypot triggered: ${field}`);
        throw new HttpException(
          {
            success: false,
            message: 'Permintaan tidak valid.',
            code: 'INVALID_REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * Validate form timing
   */
  private validateTiming(securityData: any): void {
    if (!securityData.formStartTime) return;

    const now = Date.now();
    const formDuration = now - securityData.formStartTime;

    // Too fast - likely a bot
    if (formDuration < this.CONFIG.MIN_FORM_TIME) {
      console.log(`[AntiSpam] Form submitted too fast: ${formDuration}ms`);
      throw new HttpException(
        {
          success: false,
          message: 'Mohon isi form dengan lengkap.',
          code: 'TOO_FAST',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Too slow - session might be stale
    if (formDuration > this.CONFIG.MAX_FORM_TIME) {
      console.log(`[AntiSpam] Form session expired: ${formDuration}ms`);
      throw new HttpException(
        {
          success: false,
          message: 'Sesi form telah berakhir. Silakan refresh halaman.',
          code: 'SESSION_EXPIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Calculate spam score based on various factors
   */
  private calculateSpamScore(body: any, securityData: any): SpamScore {
    let score = 0;
    const reasons: string[] = [];

    // Check email patterns
    if (body.customerEmail) {
      for (const pattern of this.SPAM_PATTERNS.emails) {
        if (pattern.test(body.customerEmail)) {
          score += 30;
          reasons.push(`Suspicious email pattern: ${body.customerEmail}`);
          break;
        }
      }

      // Check for disposable email domains
      const disposableDomains = [
        'mailinator.com',
        'guerrillamail.com',
        'tempmail.com',
        '10minutemail.com',
      ];
      const emailDomain = body.customerEmail.split('@')[1]?.toLowerCase();
      if (disposableDomains.includes(emailDomain)) {
        score += 40;
        reasons.push(`Disposable email domain: ${emailDomain}`);
      }
    }

    // Check name patterns
    if (body.customerName) {
      for (const pattern of this.SPAM_PATTERNS.names) {
        if (pattern.test(body.customerName)) {
          score += 20;
          reasons.push(`Suspicious name pattern: ${body.customerName}`);
          break;
        }
      }
    }

    // Check phone patterns
    if (body.customerPhone) {
      for (const pattern of this.SPAM_PATTERNS.phones) {
        if (pattern.test(body.customerPhone.replace(/\D/g, ''))) {
          score += 25;
          reasons.push(`Suspicious phone pattern: ${body.customerPhone}`);
          break;
        }
      }
    }

    // Check message for spam patterns
    if (body.message) {
      for (const pattern of this.SPAM_PATTERNS.messages) {
        if (pattern.test(body.message)) {
          score += 35;
          reasons.push('Spam keywords in message');
          break;
        }
      }

      // Check for excessive caps
      const capsRatio =
        (body.message.match(/[A-Z]/g) || []).length / body.message.length;
      if (capsRatio > 0.5 && body.message.length > 10) {
        score += 15;
        reasons.push('Excessive caps in message');
      }
    }

    // Check company name
    if (body.company) {
      if (/^(test|asdf|company|perusahaan)$/i.test(body.company)) {
        score += 20;
        reasons.push(`Generic company name: ${body.company}`);
      }
    }

    // Missing security token
    if (!securityData.token) {
      score += 10;
      reasons.push('Missing security token');
    }

    // No fingerprint
    if (!securityData.fingerprint) {
      score += 5;
      reasons.push('No browser fingerprint');
    }

    return { score, reasons };
  }

  /**
   * Validate request signature
   */
  private validateSignature(securityData: any, body: any): void {
    // Simple signature validation - in production, use proper HMAC
    const expectedParts = [
      securityData.token,
      securityData.fingerprint,
      securityData.timestamp,
    ].filter(Boolean);

    if (expectedParts.length < 2) {
      console.log('[AntiSpam] Incomplete signature data');
      return; // Don't block, just log
    }

    // Verify timestamp is recent (within 5 minutes)
    const timestamp = parseInt(securityData.timestamp);
    if (timestamp && Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
      throw new HttpException(
        {
          success: false,
          message: 'Sesi tidak valid. Silakan refresh halaman.',
          code: 'INVALID_SESSION',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Log spam attempt for monitoring
   */
  private logSpamAttempt(ip: string, reason: string, details?: string[]): void {
    console.warn(`[AntiSpam] SPAM ATTEMPT from ${ip}: ${reason}`);
    if (details && details.length > 0) {
      console.warn(`[AntiSpam] Details: ${details.join(', ')}`);
    }
  }

  /**
   * Clean up old entries (call periodically)
   */
  cleanupOldEntries(): void {
    const now = Date.now();
    const maxAge = this.CONFIG.RATE_LIMIT_WINDOW * 2;

    for (const [key, entry] of this.ipRateLimits.entries()) {
      if (now - entry.firstRequest > maxAge) {
        this.ipRateLimits.delete(key);
      }
    }

    for (const [key, entry] of this.fingerprintRateLimits.entries()) {
      if (now - entry.firstRequest > maxAge) {
        this.fingerprintRateLimits.delete(key);
      }
    }
  }
}
