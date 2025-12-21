import { db } from "@/config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createBaseService, subscriptionErrorHandler, type WithId } from "./baseService";

export interface CategoryFields {
    name: string;
    userId: number;
    budget?: number;
    color?: string;
    description?: string
}

const collectionName = 'categories';
const baseService = createBaseService<CategoryFields>(collectionName);

export const categoryService = {
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
