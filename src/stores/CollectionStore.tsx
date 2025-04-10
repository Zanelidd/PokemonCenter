import {create, StateCreator} from 'zustand';
import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {CollectionCard} from '../types/card.types';
import {createJSONStorage, persist, PersistOptions} from "zustand/middleware";

type useCollectionStore = {
    collection: Array<CollectionCard>;
    addToCollection: (card: Card, collectionId: number) => void;
    deleteFromCollection: (cardId: string) => void;
    clearCollection: () => void;
    getCardById: (cardId: string) => Card | undefined;
    setCollectionFromApi?: (apiCollection: CollectionCard[]) => void;

};

type CollectionPersist = (
    config: StateCreator<useCollectionStore>,
    options: PersistOptions<useCollectionStore>
) => StateCreator<useCollectionStore>;

export const useCollection =
    create<useCollectionStore>(
        (persist as CollectionPersist)(
            (set, get) => ({
                collection: [],

                addToCollection: (card, collectionId: number) =>
                    set((state) => {
                        if (state.collection.some((c) => c.id === card.id)) {
                            return state;
                        }
                        return {collection: [...state.collection, {...card, collectionId}]};
                    }),

                deleteFromCollection: (cardId: string) =>
                    set((state) => ({
                        collection: state.collection.filter((card) => card.id !== cardId),
                    })),

                clearCollection: () => set({collection: []}),


                getCardById: (cardId: string): Card | undefined =>
                    get().collection.find((card: CollectionCard) => card.id === cardId),

                setCollectionFromApi: (apiCollection) => set({collection: apiCollection}),
            }),
            {
                name: 'collection-storage',
                storage: createJSONStorage(() => localStorage),
            }
        )
    );









