import { create, IPFSHTTPClient } from 'ipfs-http-client';

export class IPFSService {
  private static instance: IPFSService;
  private client: IPFSHTTPClient | null = null;

  private constructor() {}

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  async initialize(gateway: string = 'https://ipfs.infura.io:5001') {
    this.client = create({ url: gateway });
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.client) throw new Error('IPFS client not initialized');
    
    const added = await this.client.add(file);
    return added.path;
  }

  async uploadJSON(data: any): Promise<string> {
    if (!this.client) throw new Error('IPFS client not initialized');
    
    const jsonString = JSON.stringify(data);
    const added = await this.client.add(jsonString);
    return added.path;
  }

  async getFile(cid: string): Promise<Uint8Array> {
    if (!this.client) throw new Error('IPFS client not initialized');
    
    const chunks = [];
    for await (const chunk of this.client.cat(cid)) {
      chunks.push(chunk);
    }
    return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
  }

  async pin(cid: string): Promise<void> {
    if (!this.client) throw new Error('IPFS client not initialized');
    await this.client.pin.add(cid);
  }

  async unpin(cid: string): Promise<void> {
    if (!this.client) throw new Error('IPFS client not initialized');
    await this.client.pin.rm(cid);
  }
}

export const ipfsService = IPFSService.getInstance();
