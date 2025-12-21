import type { UserId } from "@/types";
import { useEffect, useReducer, useState } from "react";
import * as services from '@/services/db';

type State = {
    categories: services.WithId<services.CategoryFields>[];
    isLoading: boolean;
    error: string | null;
};

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: services.WithId<services.CategoryFields>[] }
    | { type: 'FETCH_ERROR'; payload: string };


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { isLoading: false, error: null, categories: action.payload };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload, categories: [] };
        default:
            return state;
    }
};

const initialState = {
    categories: [] as services.WithId<services.CategoryFields>[],
    isLoading: true,
    error: null,
}

const useCategories = (userId: UserId) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [retryTrigger, setRetryTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true;
        dispatch({ type: 'FETCH_START' });

        const unsubscribe = services.categoryService.subscribeToCollectionByUserId<services.WithId<services.CategoryFields>>(
            userId,
            (data) => {
                if (isMounted) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data });
                }
            },
            (error) => {
                if (isMounted) {
                    dispatch({
                        type: 'FETCH_ERROR',
                        payload: error.message || 'An error occurred while fetching categories'
                    });
                }
            }
        );

        return () => {
            isMounted = false;
            unsubscribe();
        }
    }, [userId, retryTrigger])

    return { ...state, refetch: () => setRetryTrigger(prev => prev + 1) };
}

export default useCategories;