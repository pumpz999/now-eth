import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheManager } from '../cache';

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = CacheManager.getInstance();
    cacheManager.clear();
  });

  it('should store and retrieve data', () => {
    const testData = { id: 1, name: 'Test' };
    cacheManager.set('test-key', testData);
    
    const cached = cacheManager.get('test-key');
    expect(cached).toEqual(testData);
  });

  it('should respect TTL', () => {
    const testData = { id: 1, name: 'Test' };
    cacheManager.set('test-key', testData, 100); // 100ms TTL
    
    // Fast-forward time by 200ms
    vi.advanceTimersByTime(200);
    
    const cached = cacheManager.get('test-key');
    expect(cached).toBeNull();
  });

  it('should clear expired items', () => {
    const testData = { id: 1, name: 'Test' };
    cacheManager.set('test-key', testData, 100); // 100ms TTL
    
    // Fast-forward time by 200ms
    vi.advanceTimersByTime(200);
    
    cacheManager.clearExpired();
    expect(cacheManager.get('test-key')).toBeNull();
  });
});
