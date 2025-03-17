import http from './client.ts';
import endpoints from './config/endpoints.ts';

export const apiCardService = {
  getCardBySet: async (setId: string) => {
    return http(`${endpoints.externalApi.subroutes.cards}`, {
      method: 'POST',
      body: JSON.stringify({ setId: setId }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  },

  getAllSets: async () => {
    return http(`${endpoints.externalApi.path}`, {
    method: 'GET',
    })
    .then((response) => {return response.json();})
  },

  getCardByName : async ({ name } : {name : string}) => {
    return http(`${endpoints.externalApi.subroutes.searchCard}`, {
      method: 'POST',
      body: JSON.stringify({ name: name }),
    })
      .then((response) => {return response.json();})
  },

  getCardById : async (id: string) => {
    return http(`${endpoints.externalApi.subroutes.cards}/${id}`, {
      method: 'GET',
    })
      .then((response) => {return response.json();})
      .then((data)=>{return data.data})
  }
};