import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";

export type CollectionCard = Card & { collectionId?: number };
