import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';

export type CollectionCard = Card & { collectionId?: number };
export type cardResponse = { id: number, remoteId: string, userId: number };

s