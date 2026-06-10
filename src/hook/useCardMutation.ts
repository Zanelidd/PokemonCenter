import {useMutation, useQueryClient} from "@tanstack/react-query";
import {showError, showSuccess} from "../utils/toastUtils.ts";
import {cardResponse, CollectionCard} from "../types/card.types.ts";
import type {Card} from "pokemon-tcg-sdk-typescript/dist/sdk";
import api from "../api/api.service.ts";
import {useCollection} from "../stores/CollectionStore.tsx";
import {useMe} from "./useMe.ts";

export function useCardOperations() {

    const {addToCollection, deleteFromCollection, getCardById} = useCollection()
    const {data: user} = useMe();
    const queryClient = useQueryClient();

    const addCardMutation = useMutation({
        mutationFn: async (data: Card) => {
            if (user) {
                return api.card.addCard(data.id);
            }
            throw new Error("User not found");
        },
        onSuccess: (result, data: Card) => {
            addToCollection(data, result.id);
            queryClient.setQueriesData<CollectionCard[]>(
                { queryKey: ['collection'] },
                (old) => {
                    if (!old) return [{...data, collectionId: result.id}];
                    if (old.some(c => c.id === data.id)) return old;
                    return [...old, {...data, collectionId: result.id}];
                }
            );
            showSuccess("Cards added successfully.");
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    const deleteCardMutation = useMutation({
        mutationFn: async (data: CollectionCard) => {
            return api.card.deleteCard(data.id);
        },
        onSuccess: (data: cardResponse) => {
            deleteFromCollection(data.remoteId);
            queryClient.setQueriesData<CollectionCard[]>(
                { queryKey: ['collection'] },
                (old) => old?.filter(c => c.id !== data.remoteId) ?? []
            );
            showSuccess("Card deleted successfully");
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    const handleAddCollection = (data: Card) => {
        addCardMutation.mutate(data);
    };

    const handleDeleteCollection = (data: Card) => {
        const findCard = getCardById(data.id);
        if (findCard) {
            deleteCardMutation.mutate(findCard);
        } else {
            showError("Card not found in collection");
        }
    };

    return {
        addCardMutation,
        deleteCardMutation,
        handleAddCollection,
        handleDeleteCollection,

    };
}
