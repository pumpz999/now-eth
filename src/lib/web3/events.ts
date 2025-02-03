import { ethers } from 'ethers';
import { web3Service } from './contracts';

export type EventCallback = (event: any) => void;

export class EventService {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  async subscribeToEvent(
    contract: ethers.Contract,
    eventName: string,
    callback: EventCallback
  ) {
    const eventKey = `${contract.target}_${eventName}`;
    
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, new Set());
    }
    
    this.listeners.get(eventKey)!.add(callback);
    
    contract.on(eventName, (...args) => {
      const event = args[args.length - 1];
      this.listeners.get(eventKey)!.forEach(cb => cb(event));
    });

    return () => {
      contract.off(eventName);
      this.listeners.get(eventKey)?.delete(callback);
    };
  }

  async getPastEvents(
    contract: ethers.Contract,
    eventName: string,
    fromBlock: number,
    toBlock: number | 'latest' = 'latest'
  ) {
    const filter = contract.filters[eventName]();
    return await contract.queryFilter(filter, fromBlock, toBlock);
  }
}

export const eventService = new EventService();
