import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isIP } from 'node:net';

interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
}

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secretKey: string;
  private readonly verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('TURNSTILE_SECRET_KEY') || '';
    
    if (!this.secretKey) {
      this.logger.warn('TURNSTILE_SECRET_KEY not configured');
    }
  }

  private normalizeIp(ip?: string): string | undefined {
    if (!ip) return undefined;

    let candidate = ip.trim();
    if (!candidate) return undefined;

    // x-forwarded-for may contain multiple addresses
    if (candidate.includes(',')) {
      candidate = candidate.split(',')[0].trim();
    }

    // strip wrapping brackets from IPv6 (e.g. [::1])
    if (candidate.startsWith('[') && candidate.endsWith(']')) {
      candidate = candidate.slice(1, -1);
    }

    // normalize IPv4-mapped IPv6 (e.g. ::ffff:192.168.1.10)
    const mappedPrefix = '::ffff:';
    if (candidate.toLowerCase().startsWith(mappedPrefix)) {
      candidate = candidate.slice(mappedPrefix.length);
    }

    // remove :port for IPv4 if present
    if (candidate.includes(':') && candidate.includes('.')) {
      const maybeIpv4 = candidate.split(':')[0];
      if (isIP(maybeIpv4) === 4) {
        candidate = maybeIpv4;
      }
    }

    return isIP(candidate) !== 0 ? candidate : undefined;
  }

  /**
   * Verify Turnstile token with Cloudflare API
   * @param token - Turnstile token from client
   * @param remoteIp - Optional client IP address for enhanced verification
   * @returns true if verification succeeds
   * @throws BadRequestException if verification fails
   */
  async verifyToken(token: string, remoteIp?: string): Promise<boolean> {
    if (!this.secretKey) {
      this.logger.error('Turnstile secret key not configured');
      throw new BadRequestException('TURNSTILE_NOT_CONFIGURED');
    }

    if (!token || typeof token !== 'string') {
      throw new BadRequestException('TURNSTILE_TOKEN_MISSING');
    }

    if (token.length > 2048) {
      throw new BadRequestException('TURNSTILE_TOKEN_INVALID');
    }

    try {
      const payload: Record<string, string> = {
        secret: this.secretKey,
        response: token,
      };

      const normalizedIp = this.normalizeIp(remoteIp);
      if (remoteIp && !normalizedIp) {
        this.logger.warn(`Skipping invalid remote IP for Turnstile verify: ${remoteIp}`);
      }
      if (normalizedIp) {
        payload.remoteip = normalizedIp;
      }

      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.error(`Turnstile API error: ${response.status}`);
        throw new BadRequestException('TURNSTILE_VERIFICATION_FAILED');
      }

      const result: TurnstileVerifyResponse = await response.json();

      if (!result.success) {
        this.logger.warn(`Turnstile verification failed: ${result['error-codes']?.join(', ')}`);
        throw new BadRequestException('TURNSTILE_VERIFICATION_FAILED');
      }

      // Log successful verification
      this.logger.log(`Turnstile verified: ${result.hostname} - ${result.action}`);
      
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Turnstile verification error:', error);
      throw new BadRequestException('TURNSTILE_VERIFICATION_FAILED');
    }
  }

  /**
   * Enhanced verification with additional checks
   */
  async verifyTokenEnhanced(
    token: string,
    remoteIp?: string,
    expectedAction?: string,
    expectedHostname?: string,
  ): Promise<TurnstileVerifyResponse> {
    if (!this.secretKey) {
      throw new BadRequestException('TURNSTILE_NOT_CONFIGURED');
    }

    try {
      const payload: Record<string, string> = {
        secret: this.secretKey,
        response: token,
      };

      const normalizedIp = this.normalizeIp(remoteIp);
      if (remoteIp && !normalizedIp) {
        this.logger.warn(`Skipping invalid remote IP for Turnstile verify: ${remoteIp}`);
      }
      if (normalizedIp) {
        payload.remoteip = normalizedIp;
      }

      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: TurnstileVerifyResponse = await response.json();

      if (!result.success) {
        throw new BadRequestException('TURNSTILE_VERIFICATION_FAILED');
      }

      // Validate action if specified
      if (expectedAction && result.action !== expectedAction) {
        this.logger.warn(`Action mismatch: expected ${expectedAction}, got ${result.action}`);
        throw new BadRequestException('TURNSTILE_ACTION_MISMATCH');
      }

      // Validate hostname if specified
      if (expectedHostname && result.hostname !== expectedHostname) {
        this.logger.warn(`Hostname mismatch: expected ${expectedHostname}, got ${result.hostname}`);
        throw new BadRequestException('TURNSTILE_HOSTNAME_MISMATCH');
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Turnstile verification error:', error);
      throw new BadRequestException('TURNSTILE_VERIFICATION_FAILED');
    }
  }
}
