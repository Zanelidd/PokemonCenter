import { create } from 'zustand';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { CollectionCard } from '../types';

type useCollectionStore = {
  collection: Array<CollectionCard>;
  addToCollection: (card: Card, collectionId: number) => void;
  deleteFromCollection: (cardId: string) => void;
  clearCollection: () => void;
  // isInCollection: (cardId: string) => boolean;
  getCardById: (cardId: string) => Card | undefined;
  fillCollection: (userId: number | undefined, token : string) => void;
};

export const useCollection = create<useCollectionStore>((set) => ({
  collection: [],

  addToCollection: (card, collectionId: number) =>
    set((state) => {
      if (state.collection.some((c) => c.id === card.id)) {
        return state;
      }
      return { collection: [...state.collection, { ...card, collectionId }] };
    }),

  deleteFromCollection: (cardId: string) =>
    set((state) => ({
      collection: state.collection.filter((card) => card.id !== cardId),
    })),

  clearCollection: () => set({ collection: [] }),


  getCardById: (cardId: string): Card | undefined =>
    useCollection
      .getState()
      .collection.find((card: CollectionCard) => card.id === cardId),

  fillCollection: (userId,token) => {

    fetch(`${import.meta.env.VITE_BACKEND_URL}/card/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.error(err);
      })
  }
}));
