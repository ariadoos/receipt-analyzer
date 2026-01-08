import { FirestoreServiceError } from '@/lib/dbErrors';
import * as services from '@/services/db';
import { Timestamp, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { create } from 'zustand';

interface ExpensesState {
    expenses: services.WithId<services.ExpenseFields>[];
    initialLoading: boolean;
    isLoading: boolean;
    error: string | null;
    filters: services.ExpensesFilterState;
    pagination: services.PaginationState;
}

interface ExpensesActions {
    fetchExpenses: (
        userId: number,
        shouldAppend?: boolean,
        cursor?: QueryDocumentSnapshot<DocumentData, DocumentData> | null
    ) => Promise<void>;
    addExpense: (expense: services.ExpenseFields) => Promise<string>;
    updateExpense: (id: string, expense: Partial<services.ExpenseFields>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    loadMore: (userId: number) => void;
    setFilters: (filters: services.ExpensesFilterState) => void;
    refetch: (userId: number, shouldAppend?: boolean, lastDoc?: QueryDocumentSnapshot<DocumentData, DocumentData> | null) => void;
    reset: () => void;
}

type ExpensesStore = ExpensesState & ExpensesActions;

const initialState: ExpensesState = {
    expenses: [],
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
};

export const useExpensesStore = create<ExpensesStore>((set, get) => ({
    ...initialState,

    fetchExpenses: async (userId, shouldAppend = false, cursor = null) => {
        try {
            set({ isLoading: true, error: null });

            const { filters } = get();

            const { data, pagination } = await services.expenseService.getPaginatedExpensesByUserId<services.ExpenseFields>(
                userId,
                filters,
                cursor
            );

            set((state) => ({
                expenses: shouldAppend ? [...state.expenses, ...data] : data,
                isLoading: false,
                initialLoading: false,
                error: null,
                pagination
            }));

        } catch (err) {
            let errorMessage = 'Failed to fetch expenses';
            if (err instanceof FirestoreServiceError) {
                errorMessage = err.message;
            }

            set({
                isLoading: false,
                initialLoading: false,
                error: errorMessage,
                expenses: []
            });
        }
    },

    addExpense: async (expense: services.ExpenseFields) => {
        const expenseId = await services.expenseService.create(expense);

        const { refetch } = get();
        refetch(expense.userId, false, null);

        return expenseId;
    },

    updateExpense: async (id: string, expense: Partial<Omit<services.ExpenseFields, 'userId'>>) => {
        await services.expenseService.update(id, expense);

        const { expenses } = get();

        const updateExpenses = expenses.map((exp) => {
            if (exp.id === id) {
                return {
                    ...exp,
                    ...expense,
                    updatedAt: Timestamp.now()
                }
            }

            return exp;
        })

        set({ expenses: updateExpenses })
    },

    deleteExpense: async (id: string) => {

        await services.expenseService.delete(id);
        const { expenses } = get();

        const updatedExpenses = expenses.filter((exp) => exp.id !== id);

        set((state) => ({
            expenses: updatedExpenses,
            pagination: {
                ...state.pagination,
                totalCount: state.pagination.totalCount - 1,
            }
        }));
    },

    loadMore: (userId) => {
        const { isLoading, pagination, fetchExpenses } = get();

        if (!isLoading && pagination.hasMore) {
            fetchExpenses(userId, true, pagination.lastDoc);
        }
    },

    setFilters: (filters) => {
        set({ filters });
    },

    refetch: (userId, shouldAppend = false, lastDoc = null) => {
        const { fetchExpenses } = get();
        fetchExpenses(userId, shouldAppend, lastDoc);
    },

    reset: () => {
        set(initialState);
    }
}));