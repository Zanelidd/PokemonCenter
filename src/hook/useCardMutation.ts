import {useMutation} from "@tanstack/react-query";
import {showError, showSuccess} from "../utils/toastUtils.ts";
import {cardResponse, CollectionCard} from "../types/card.types.ts";
import Card from "../components/card/Card.tsx";
import api from "../api/api.service.ts";
import {useCollection} from "../stores/CollectionStore.tsx";
import {useUser} from "../stores/UserStore.tsx";

export function useCardOperations() {

    const {addToCollection, deleteFromCollection, getCardById} = useCollection()
    const {user} = useUser()

    const addCardMutation = useMutation({
        mutationFn: async (data: Card) => {
            if (user) {
                return api.card.addCard(user.userId, data.id);
            }
            throw new Error("User not found");
        },
        onSuccess: (result, data: Card) => {
            addToCollection(data, result.id);
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
