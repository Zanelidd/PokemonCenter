import endpoints from './config/endpoints.ts';
import Card from '../components/card/Card.tsx';
import { useCollection } from '../stores/CollectionStore.tsx';
import http from './client.ts';
import { cardResponse } from '../types/card.types.ts';

export const cardService = {
  getCard: async (userId: number) => {
    return http(`${endpoints.card.path}/${userId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((result) => {
        result.map((card: Card) => {
          return  useCollection.getState().addToCollection(card, result.id);
        });
      });
  },
  addCard: async (userId: number, remoteId: string) => {
    return http(endpoints.card.path, {
      method: 'POST',
      body: JSON.stringify({ cardId: remoteId, userId: userId }),
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

