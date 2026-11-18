import http from './client.ts';
import endpoints from './config/endpoints.ts';

export const apiCardService = {
  getCardBySet: async (setId: string) => {
    return http(`${endpoints.externalApi.subroutes.cards}?setId=${encodeURIComponent(setId)}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  getAllSets: async () => {
    return http(`${endpoints.externalApi.path}`, {
      method: 'GET',
    }).then((response) => response.json());
  },

  getCardByName: async ({ name }: { name: string }) => {
    return http(`${endpoints.externalApi.subroutes.searchCard}?name=${encodeURIComponent(name)}`, {
      method: 'GET',
    }).then((response) => response.json());
  },

  getCardById: async (id: string) => {
    return http(`${endpoints.externalApi.subroutes.cards}/${id}`, {
      method: 'GET',
    }).then((response) => response.json());
  },
};
