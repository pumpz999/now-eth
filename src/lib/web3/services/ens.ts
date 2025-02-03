import { ethers } from 'ethers';

export class ENSService {
  private static instance: ENSService;
  private provider: ethers.Provider | null = null;

  private constructor() {}

  static getInstance(): ENSService {
    if (!ENSService.instance) {
      ENSService.instance = new ENSService();
    }
    return ENSService.instance;
  }

  async initialize(provider: ethers.Provider) {
    this.provider = provider;
  }

  async resolveName(name: string): Promise<string | null> {
    if (!this.provider) return null;
    try {
      return await this.provider.resolveName(name);
    } catch (error) {
      console.error('ENS resolution error:', error);
      return null;
    }
  }

  async lookupAddress(address: string): Promise<string | null> {
    if (!this.provider) return null;
    try {
      return await this.provider.lookupAddress(address);
    } catch (error) {
      console.error('ENS lookup error:', error);
      return null;
    }
  }

  async getAvatar(nameOrAddress: string): Promise<string | null> {
    if (!this.provider) return null;
    try {
      const resolver = await this.provider.getResolver(nameOrAddress);
      if (!resolver) return null;
      return await resolver.getAvatar();
    } catch (error) {
      console.error('ENS avatar error:', error);
      return null;
    }
  }
}

export const ensService = ENSService.getInstance();
