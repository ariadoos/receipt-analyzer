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

export const EXPENSES_PER_PAGE = 10;

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
                where("userId", "==", userId),
                orderBy("createdAt", "desc"),
            ];

            if (startDate) {
                constraints.push(
                    where("createdAt", ">=", Timestamp.fromDate(startDate))
                );
            }

            if (endDate) {
                constraints.push(
                    where("createdAt", "<=", Timestamp.fromDate(endDate))
                );
            }

            if (minAmount !== null && minAmount !== undefined && !isNaN(parseInt(minAmount))) {
                constraints.push(
                    where("amount", ">=", parseInt(minAmount))
                );
            }

            if (maxAmount !== null && maxAmount !== undefined && !isNaN(parseInt(maxAmount))) {
                constraints.push(
                    where("amount", "<=", parseInt(maxAmount))
                );
            }

            if (searchTerm) {
                const normalized = searchTerm.toLowerCase();
                constraints.push(
                    where("description", ">=", normalized),
                    where("description", "<=", normalized + "\uf8ff")
                );
            }

            // const queryForTotalCount = query(collection(db, collectionName), ...constraints);
            // const totalCount = await fetchTotalCount(queryForTotalCount);

            if (cursor) {
                // next
                constraints.push(startAfter(cursor), limit(fetchLimit));

                //prev
                // constraints.push(endBefore(cursor), limitToLast(fetchLimit));
            } else {
                constraints.push(limit(fetchLimit));
            }

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
                totalCount: 0
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
