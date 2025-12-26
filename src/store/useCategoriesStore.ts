import * as services from '@/services/db';
import type { UserId } from "@/types";
import { type Unsubscribe } from "firebase/firestore";
import { create } from 'zustand';

interface CategoriesStore {
    categories: services.WithId<services.CategoryFields>[];
    loading: boolean;
    error: string | null;
    currentUserId: UserId | null;

    subscribeToCategories: (userId: UserId) => () => void;
    refetch: () => void;

    addCategory: (categoryData: services.CategoryFields) => Promise<string>;
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => {
    let unsubscribeCategories: Unsubscribe | undefined;

    return {
        categories: [],
        loading: false,
        error: null,
        currentUserId: null,
        unsubscribeCategories: null,

        subscribeToCategories: (userId: UserId) => {
            set({ currentUserId: userId });

            if (unsubscribeCategories) {
                unsubscribeCategories();
                unsubscribeCategories = undefined;
            }

            set({ loading: true, error: null });

            console.log('Listening to categories')

            const unsubscribe = services.categoryService.subscribeToCollectionByUserId<services.WithId<services.CategoryFields>>(
                userId,
                (data) => {
                    set({ categories: data, loading: false, error: null })
                },
                (error) => {
                    const errorMessage = error.message || 'An error occurred while fetching categories';
                    set({ error: errorMessage, loading: false });
                }
            );

            unsubscribeCategories = unsubscribe;

            // Return cleanup function
            return () => {
                if (unsubscribeCategories !== undefined) {
                    console.log('Unsubscribing categories listener.')
                    unsubscribeCategories();
                    unsubscribeCategories = undefined;
                }

            };
        },

        refetch: () => {
            const { currentUserId } = get();

            if (!currentUserId) {
                return;
            }

            if (unsubscribeCategories) {
                unsubscribeCategories();
                unsubscribeCategories = undefined;
            }

            set({ loading: true });

            const subscriptionToUnsubscribe = services.categoryService.subscribeToCollectionByUserId<services.WithId<services.CategoryFields>>(
                currentUserId,
                (data) => {
                    set({ categories: data, loading: false, error: null })
                },
                (error) => {
                    const errorMessage = error.message || 'An error occurred while fetching categories';
                    set({ error: errorMessage, loading: false });
                }
            );

            unsubscribeCategories = subscriptionToUnsubscribe;
        },

        addCategory: async (categoryData) => {
            const savedId = await services.categoryService.create(categoryData);
            return savedId;
        }
    }
});