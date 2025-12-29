import { FirestoreServiceError } from '@/lib/dbErrors';
import * as services from '@/services/db';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useReducer } from "react";

type State = {
    expenses: services.WithId<services.ExpenseFields>[];
    initialLoading: boolean;
    isLoading: boolean;
    error: string | null;
    filters: services.ExpensesFilterState;
    pagination: services.PaginationState;
};

type Action =
    | { type: 'FETCH_START' }
    | {
        type: 'FETCH_SUCCESS'; payload: {
            data: services.WithId<services.ExpenseFields>[],
            shouldAppend: boolean
        }
    }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'UPDATE_PAGINATION'; payload: services.PaginationState }
    | { type: 'UPDATE_INITIAL_LOADING' }
    | { type: 'SET_FILTERS', payload: services.ExpensesFilterState };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case 'FETCH_SUCCESS': {
            const shouldAppend = action.payload.shouldAppend;
            const expenses = shouldAppend ? [...state.expenses, ...action.payload.data] : action.payload.data;

            return {
                ...state,
                isLoading: false,
                error: null,
                expenses,
            };
        }
        case 'FETCH_ERROR':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                expenses: []
            };
        case 'UPDATE_PAGINATION': {
            const pagination = action.payload;

            return {
                ...state,
                pagination
            };
        }
        case 'UPDATE_INITIAL_LOADING': {
            const prevState = state.initialLoading;

            if (prevState === true) {
                return {
                    ...state,
                    initialLoading: false
                }
            }

            return state;
        }
        case 'SET_FILTERS':
            return {
                ...state,
                filters: action.payload
            };
        default:
            return state;
    }
};

const initialState = {
    expenses: [] as services.WithId<services.ExpenseFields>[],
    isLoading: true,
    initialLoading: true,
    error: null,
    filters: {
        startDate: null,
        endDate: null,
        minAmount: null,
        maxAmount: null,
        searchTerm: '',
    },
    pagination: {
        pageSize: services.EXPENSES_PER_PAGE,
        hasMore: true,
        totalCount: 0,
        lastDoc: null
    }
}

const useExpensesList = () => {
    const userId = 1;
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchExpenses = useCallback(async (shouldAppend = false, cursor?: QueryDocumentSnapshot<DocumentData, DocumentData> | null) => {
        try {
            dispatch({ type: "FETCH_START" });

            const { data, pagination } =
                await services.expenseService.getPaginatedExpensesByUserId<services.ExpenseFields>(
                    userId,
                    state.filters,
                    cursor
                );

            dispatch({
                type: "FETCH_SUCCESS",
                payload: { data, shouldAppend },
            });

            dispatch({
                type: "UPDATE_PAGINATION",
                payload: pagination,
            });

            dispatch({ type: "UPDATE_INITIAL_LOADING" });
        } catch (err) {
            let errorMessage = 'Failed to fetch expenses';
            if (err instanceof FirestoreServiceError) {
                errorMessage = err.message
            }

            dispatch({ type: "UPDATE_INITIAL_LOADING" });

            dispatch({
                type: "FETCH_ERROR",
                payload: errorMessage,
            });
        }
    }, [state.filters])

    const loadMore = useCallback(() => {
        if (!state.isLoading && state.pagination.hasMore) {
            fetchExpenses(true, state.pagination.lastDoc)
        }
    }, [state.isLoading, state.pagination.hasMore, state.pagination.lastDoc, fetchExpenses])

    const setFilters = useCallback((filters: services.ExpensesFilterState) => {
        dispatch({
            type: "SET_FILTERS",
            payload: filters,
        });
    }, [])

    useEffect(() => {
        fetchExpenses(false);
    }, [userId, state.filters, fetchExpenses])

    return {
        ...state,
        loadMore,
        setFilters,
        refetch: () => fetchExpenses(!state.initialLoading, state.pagination.lastDoc)
    };
}

export default useExpensesList;