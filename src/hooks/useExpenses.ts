import type { UserId } from "@/types";
import { useEffect, useReducer, useState } from "react";
import * as services from '@/services/db';

type State = {
    expenses: services.WithId<services.ExpenseFields>[];
    isLoading: boolean;
    error: string | null;
};

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: services.WithId<services.ExpenseFields>[] }
    | { type: 'FETCH_ERROR'; payload: string };


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { isLoading: false, error: null, expenses: action.payload };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload, expenses: [] };
        default:
            return state;
    }
};

const initialState = {
    expenses: [] as services.WithId<services.ExpenseFields>[],
    isLoading: true,
    error: null,
}

const useExpenses = (userId: UserId) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [retryTrigger, setRetryTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true;
        dispatch({ type: 'FETCH_START' });

        const unsubscribe = services.expenseService.subscribeToCollectionByUserId<services.WithId<services.ExpenseFields>>(
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
                        payload: error.message || 'An error occurred while fetching expenses'
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

export default useExpenses;