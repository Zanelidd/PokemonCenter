import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { create } from "zustand";

type useCollectionStore = {
  collection: Array<Card>;
  addToCollection: (card: Card) => void;
  deleteFromCollection: (cardId: string) => void;
};
export const useCollection = create<useCollectionStore>((set) => ({
  collection: [],
  addToCollection: (card: Card) =>
    set((state) => ({
      collection: [...state.collection, card],
    })),
  deleteFromCollection: (cardId: string) =>
    set((state) => ({
      collection: state.collection.filter((card) => card.id !== cardId),
    })),
}));
