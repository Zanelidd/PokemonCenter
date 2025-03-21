import { create } from 'zustand';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { CollectionCard } from '../types/card.types';


type useCollectionStore = {
  collection: Array<CollectionCard>;
  addToCollection: (card: Card, collectionId: number) => void;
  deleteFromCollection: (cardId: string) => void;
  clearCollection: () => void;
  getCardById: (cardId: string) => Card | undefined;

};

export const useCollection = create<useCollectionStore>((set) => {
  return {
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


  };
});


