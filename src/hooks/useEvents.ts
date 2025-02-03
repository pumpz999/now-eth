import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { eventService, EventCallback } from '../lib/web3/events';

export function useEvents(
  contract: ethers.Contract | null,
  eventName: string,
  callback: EventCallback
) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contract) return;

    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      unsubscribe = await eventService.subscribeToEvent(
        contract,
        eventName,
        (event) => {
          callback(event);
          setEvents(prev => [event, ...prev]);
        }
      );
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [contract, eventName, callback]);

  const loadPastEvents = useCallback(async (fromBlock: number) => {
    if (!contract) return;

    setLoading(true);
    try {
      const pastEvents = await eventService.getPastEvents(
        contract,
        eventName,
        fromBlock
      );
      setEvents(pastEvents.reverse());
    } catch (error) {
      console.error('Failed to load past events:', error);
    } finally {
      setLoading(false);
    }
  }, [contract, eventName]);

  return {
    events,
    loading,
    loadPastEvents,
  };
}
