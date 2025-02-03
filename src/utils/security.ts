import { ethers } from 'ethers';

export class SecurityManager {
  private static instance: SecurityManager;
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 100;
  private requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

  private constructor() {}

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  checkRateLimit(address: string): boolean {
    const now = Date.now();
    const userRequests = this.requestCounts.get(address);

    if (!userRequests || now - userRequests.timestamp > this.RATE_LIMIT_WINDOW) {
      this.requestCounts.set(address, { count: 1, timestamp: now });
      return true;
    }

    if (userRequests.count >= this.MAX_REQUESTS) {
      return false;
    }

    userRequests.count++;
    return true;
  }

  validateSignature(message: string, signature: string, address: string): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  generateNonce(): string {
    return ethers.randomBytes(32).toString('hex');
  }

  hashData(data: string): string {
    return ethers.id(data);
  }
}

export const securityManager = SecurityManager.getInstance();
