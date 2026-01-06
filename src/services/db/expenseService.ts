import { db } from "@/config/firebase";
import { handleFirestoreError } from "@/lib/dbErrors";
import type { UserId } from "@/types";
import { collection, getCountFromServer, getDocs, limit, onSnapshot, orderBy, Query, query, QueryConstraint, QueryDocumentSnapshot, startAfter, Timestamp, where, type DocumentData } from "firebase/firestore";
import { createBaseService, subscriptionErrorHandler, type WithId } from "./baseService";

export interface ExpenseFields {
    amount: number;
    description: string
    userId: number;
    categoryId?: string;
}

export type ExpensesFilterState = {
    startDate: Date | null
    endDate: Date | null
    minAmount: string | null
    maxAmount: string | null
    searchTerm: string
}

export type PaginationState = {
    pageSize: number
    hasMore: boolean
    totalCount: number
    lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
}

export const EXPENSES_PER_PAGE = 5;

const fetchTotalCount = async (q: Query<DocumentData, DocumentData>) => {
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
}

const collectionName = 'expenses';
const baseService = createBaseService<ExpenseFields>(collectionName);

export const expenseService = {
    ...baseService,

    subscribeToCollectionByUserId: <T>(
        userId: number,
        onUpdate: (data: WithId<T>[]) => void,
        onError?: (error: Error) => void
    ) => {
        const q = query(
            collection(db, collectionName),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as WithId<T>[];

                onUpdate(data);
            },
            subscriptionErrorHandler(`Failed to listen to collection by userId`, onError)
        );

        return unsubscribe;
    },

    getPaginatedExpensesByUserId: async<T>(
        userId: UserId,
        options: ExpensesFilterState,
        cursor?: QueryDocumentSnapshot<DocumentData, DocumentData> | null
    ): Promise<{
        data: WithId<T>[];
        pagination: PaginationState
    }> => {
        return handleFirestoreError(async () => {
            const {
                startDate,
                endDate,
                minAmount,
                maxAmount,
                searchTerm,
            } = options;

            const pageSize = EXPENSES_PER_PAGE;
            const fetchLimit = pageSize + 1;

            const constraints: QueryConstraint[] = [
                where("userId", "==", userId)
            ];

            // 1. AMOUNT FILTERS (Inequality)
            if (minAmount && !isNaN(parseFloat(minAmount))) {
                constraints.push(where("amount", ">=", parseFloat(minAmount)));
            }
            if (maxAmount && !isNaN(parseFloat(maxAmount))) {
                constraints.push(where("amount", "<=", parseFloat(maxAmount)));
            }

            // 2. SEARCH TERM (Inequality - "Starts With")
            if (searchTerm) {
                const normalized = searchTerm.toLowerCase();
                constraints.push(where("description", ">=", normalized));
                constraints.push(where("description", "<=", normalized + "\uf8ff"));
            }

            // 3. DATE FILTERS (Inequality)
            if (startDate) {
                constraints.push(where("createdAt", ">=", Timestamp.fromDate(startDate)));
            }
            if (endDate) {
                constraints.push(where("createdAt", "<=", Timestamp.fromDate(endDate)));
            }

            const queryForTotalCount = query(collection(db, collectionName), ...constraints);
            const totalCount = await fetchTotalCount(queryForTotalCount);

            // 4. SORTING
            constraints.push(orderBy("createdAt", "desc"));

            // 5. PAGINATION
            if (cursor) {
                constraints.push(startAfter(cursor));
            }
            constraints.push(limit(fetchLimit));

            console.log(constraints);
            const q = query(collection(db, collectionName), ...constraints);
            const snapshot = await getDocs(q);

            const data: WithId<T>[] = snapshot.docs
                .slice(0, pageSize)
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as WithId<T>[];

            const hasMore = snapshot.docs.length > pageSize;

            const pagination = {
                hasMore,
                lastDoc: snapshot.docs[snapshot.docs.length - 2] ?? null,
                pageSize: EXPENSES_PER_PAGE,
                totalCount
            }

            return {
                data,
                pagination
            };
        }, `Failed to fetch data from ${collectionName}`)
    },

    getTotalCount: async (
        q: Query<DocumentData, DocumentData>
    ) => {
        return await fetchTotalCount(q);
    }
}
