import endpoints from './config/endpoints.ts';
import http from './client.ts';
import { cardResponse, CollectionCard } from '../types/card.types.ts';

export const cardService = {
  getCard: async (userId: number): Promise<CollectionCard[]> => {
    const res = await http(`${endpoints.card.path}/${userId}`, { method: 'GET' });
    return res.json();
  },
  addCard: async (remoteId: string) => {
    return http(endpoints.card.path, {
      method: 'POST',
      body: JSON.stringify({ cardId: remoteId }),
    })
      .then((res) => res.json())
      .then((response: cardResponse) => {
        return response;
      });
  },
  deleteCard: async (cardId: string) => {
    return http(`${endpoints.card.path}/${cardId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((response: cardResponse) => {
        return response;
      });
  },
};
