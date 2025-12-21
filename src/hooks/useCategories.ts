import type { UserId } from "@/types";
import { useEffect, useState } from "react";
import * as services from '@/services/db';

interface UseCategoriesState {
    categories: services.WithId<services.CategoryFields>[];
    isLoading: boolean;
    error: string | null;
}

const initialState = {
    categories: [] as services.WithId<services.CategoryFields>[],
    isLoading: true,
    error: null,
}

const useCategories = (userId: UserId) => {
    const [state, setState] = useState<UseCategoriesState>(initialState);
    const [retryTrigger, setRetryTrigger] = useState(0);

    useEffect(() => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const unsubscribe = services.categoryService.subscribeToCollectionByUserId<services.WithId<services.CategoryFields>>(
            userId,
            (data) => {
                setState({ isLoading: false, error: null, categories: data });
            },
            (error) => {
                setState(prev => ({ ...prev, isLoading: false, error: error.message || 'An error occurred while fetching categories', categories: [] }));
            }
        );

        return () => unsubscribe();
    }, [userId, retryTrigger])

    return { ...state, refetch: () => setRetryTrigger(prev => prev + 1) };
}

export default useCategories;