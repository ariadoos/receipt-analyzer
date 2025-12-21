import { collection, addDoc, doc, getDoc, Timestamp, getDocs, updateDoc, deleteDoc, type Unsubscribe, onSnapshot, QuerySnapshot, FirestoreError, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { FirestoreServiceError, handleFirestoreError } from "@/lib/dbErrors";
import { cleanObject } from "@/lib/utils";

// The base fields every doc will have
export interface BaseFields {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// A helper to say: "Take T, and add the base fields to it"
export type WithId<T> = T & BaseFields;

export const subscriptionErrorHandler = (errorMessage: string, onError?: (error: FirestoreServiceError) => void) => {
    return (error: FirestoreError) => {
        const serviceError = new FirestoreServiceError(errorMessage);

        onError?.(serviceError);
        console.error("Subscription error:", error);
    };
}

export const createBaseService = <T extends object>(
    collectionName: string
) => {
    const colRef = collection(db, collectionName);

    return {
        getAll: (): Promise<WithId<T>[]> =>
            handleFirestoreError<WithId<T>[]>(async () => {
                const snap = await getDocs(colRef);

                return snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })) as WithId<T>[]

            }, `Failed to fetch data from ${collectionName}`),

        getByDocumentId: (id: string): Promise<WithId<T> | null> =>
            handleFirestoreError<WithId<T> | null>(async () => {
                if (!id?.trim()) {
                    throw new FirestoreServiceError("Id is required");
                }

                const docRef = doc(db, collectionName, id)
                const snap = await getDoc(docRef);

                return snap.exists()
                    ? { id: snap.id, ...snap.data() } as WithId<T>
                    : null;

            }, `Failed to fetch from ${collectionName} by id`),

        create: (data: T): Promise<string> =>
            handleFirestoreError(async () => {
                const docData = cleanObject<T>({
                    ...data,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });

                const ref = await addDoc(colRef, docData);
                return ref.id;

            }, `Failed to create in ${collectionName}`),

        update: (id: string, updates: Partial<Omit<T, "id" | "createdAt">>): Promise<void> =>
            handleFirestoreError(async () => {
                if (!id?.trim()) {
                    throw new FirestoreServiceError("Id is required");
                }

                const docRef = doc(db, collectionName, id);
                const snap = await getDoc(docRef);

                if (!snap.exists()) {
                    throw new FirestoreServiceError("Data not found", "not-found");
                }

                const updateData = cleanObject({
                    ...updates,
                    updatedAt: Timestamp.now()
                });

                await updateDoc(docRef, updateData);

            }, `Failed to create in ${collectionName}`),

        delete: (id: string): Promise<void> =>
            handleFirestoreError(async () => {
                if (!id?.trim()) {
                    throw new FirestoreServiceError("Id is required");
                }

                const docRef = doc(db, collectionName, id);
                const snap = await getDoc(docRef);
                if (!snap.exists()) {
                    throw new FirestoreServiceError("Data not found", "not-found");
                }

                await deleteDoc(docRef);
            }, `Failed to delete data`),

        subscribeToCollection: (
            onUpdate: (data: T[]) => void,
            onError?: (error: FirestoreServiceError) => void
        ): Unsubscribe => {
            return onSnapshot(
                colRef,
                (snapshot: QuerySnapshot) => {
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })) as T[]

                    onUpdate(data)
                },
                subscriptionErrorHandler(`Failed to listen to collection`, onError)
            )
        },

        subscribeToDocument: (
            id: string,
            onUpdate: (data: T | null) => void,
            onError?: (error: FirestoreServiceError) => void
        ): Unsubscribe => {
            if (!id?.trim()) {
                throw new FirestoreServiceError("Id is required");
            }
            const docRef = doc(db, collectionName, id);

            return onSnapshot(
                docRef,
                (snapshot: DocumentSnapshot) => {
                    if (!snapshot.exists()) {
                        onUpdate(null);
                        return;
                    }

                    const data: T = {
                        id: snapshot.id,
                        ...snapshot.data()
                    } as T;

                    onUpdate(data)
                },
                subscriptionErrorHandler(`Failed to listen to document`, onError)
            )
        }
    };
};