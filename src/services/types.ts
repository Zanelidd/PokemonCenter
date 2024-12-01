import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";

export type CollectionCard = Card & { collectionId?: number };

export type User = { username: string; access_token: string; userId: number };

