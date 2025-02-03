import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityManager } from '../security';

describe('SecurityManager', () => {
  let securityManager: SecurityManager;

  beforeEach(() => {
    securityManager = SecurityManager.getInstance();
  });

  it('should enforce rate limiting', () => {
    const address = '0x123...';
    
    // First 100 requests should pass
    for (let i = 0; i < 100; i++) {
      expect(securityManager.checkRateLimit(address)).toBe(true);
    }
    
    // 101st request should fail
    expect(securityManager.checkRateLimit(address)).toBe(false);
  });

  it('should validate signatures correctly', () => {
    const message = 'Test message';
    const validSignature = '0x...'; // Add a valid signature
    const validAddress = '0x...'; // Add corresponding address
    
    expect(securityManager.validateSignature(message, validSignature, validAddress)).toBe(true);
  });

  it('should sanitize input properly', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = securityManager.sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
  });
});
