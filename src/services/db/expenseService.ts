import { db } from "@/config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createBaseService, subscriptionErrorHandler, type WithId } from "./baseService";

export interface ExpenseFields {
    amount: number;
    description: string
    userId: number;
    categoryId?: string;
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
    }
}
