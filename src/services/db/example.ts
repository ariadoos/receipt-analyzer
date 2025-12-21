import { db } from "@/config/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    writeBatch,
    onSnapshot,
    type Unsubscribe,
    DocumentSnapshot,
    QuerySnapshot,
    FirestoreError
} from "firebase/firestore";

// ============ TYPES ============

interface CategoryDocument {
    name: string;
    budget: number;
    color: string;
    description?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Category extends CategoryDocument {
    id: string;
}

// Custom error class for better error handling
export class CategoryError extends Error {
    constructor(
        message: string,
        code?: string,
        originalError?: unknown
    ) {
        super(message);
        this.name = "CategoryError";
    }
}

const COLLECTION_NAME = "categories";

// ============ ERROR HANDLING WRAPPER ============

async function handleFirestoreError<T>(
    operation: () => Promise<T>,
    errorMessage: string
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        const firestoreError = error as FirestoreError;

        // Map Firestore errors to user-friendly messages
        let message = errorMessage;
        switch (firestoreError.code) {
            case "permission-denied":
                message = "You don't have permission to perform this action";
                break;
            case "not-found":
                message = "Category not found";
                break;
            case "already-exists":
                message = "Category already exists";
                break;
            case "unavailable":
                message = "Service temporarily unavailable. Please try again";
                break;
            case "unauthenticated":
                message = "Please sign in to continue";
                break;
        }

        throw new CategoryError(message, firestoreError.code, error);
    }
}

// ============ CREATE ============

export const createCategory = async (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
    return handleFirestoreError(async () => {
        // Validation
        if (!categoryData.name?.trim()) {
            throw new CategoryError("Category name is required");
        }
        if (categoryData.budget < 0) {
            throw new CategoryError("Budget cannot be negative");
        }

        const colRef = collection(db, COLLECTION_NAME);
        const docData: CategoryDocument = {
            ...categoryData,
            name: categoryData.name.trim(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(colRef, docData);
        return docRef.id;
    }, "Failed to create category");
};

export const createCategoryWithId = async (
    id: string,
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<void> => {
    return handleFirestoreError(async () => {
        if (!id?.trim()) {
            throw new CategoryError("Category ID is required");
        }

        const docRef = doc(db, COLLECTION_NAME, id);

        // Check if document already exists
        const existingDoc = await getDoc(docRef);
        if (existingDoc.exists()) {
            throw new CategoryError("Category with this ID already exists", "already-exists");
        }

        const docData: CategoryDocument = {
            ...categoryData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        await setDoc(docRef, docData);
    }, "Failed to create category with custom ID");
};

// ============ READ ============

export const getCategories = async (): Promise<Category[]> => {
    return handleFirestoreError(async () => {
        const colRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(colRef);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Category[];
    }, "Failed to fetch categories");
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    return handleFirestoreError(async () => {
        if (!id?.trim()) {
            throw new CategoryError("Category ID is required");
        }

        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Category;
    }, "Failed to fetch category");
};

export const getCategoriesByBudget = async (
    minBudget: number,
    maxResults: number = 50
): Promise<Category[]> => {
    return handleFirestoreError(async () => {
        const colRef = collection(db, COLLECTION_NAME);
        const q = query(
            colRef,
            where("budget", ">=", minBudget),
            orderBy("budget", "desc"),
            limit(maxResults)
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Category[];
    }, "Failed to fetch categories by budget");
};

export const searchCategoriesByName = async (
    searchTerm: string
): Promise<Category[]> => {
    return handleFirestoreError(async () => {
        const colRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(colRef);

        // Firestore doesn't support full-text search, so we filter client-side
        return querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as Category)
            .filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, "Failed to search categories");
};

// ============ UPDATE ============

export const updateCategory = async (
    id: string,
    updates: Partial<Omit<Category, "id" | "createdAt">>
): Promise<void> => {
    return handleFirestoreError(async () => {
        if (!id?.trim()) {
            throw new CategoryError("Category ID is required");
        }

        // Validation
        if (updates.budget !== undefined && updates.budget < 0) {
            throw new CategoryError("Budget cannot be negative");
        }
        if (updates.name !== undefined && !updates.name.trim()) {
            throw new CategoryError("Category name cannot be empty");
        }

        const docRef = doc(db, COLLECTION_NAME, id);

        // Check if document exists
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new CategoryError("Category not found", "not-found");
        }

        const updateData = {
            ...updates,
            updatedAt: Timestamp.now()
        };

        if (updates.name) {
            updateData.name = updates.name.trim();
        }

        await updateDoc(docRef, updateData);
    }, "Failed to update category");
};

// ============ DELETE ============

export const deleteCategory = async (id: string): Promise<void> => {
    return handleFirestoreError(async () => {
        if (!id?.trim()) {
            throw new CategoryError("Category ID is required");
        }

        const docRef = doc(db, COLLECTION_NAME, id);

        // Check if document exists before deleting
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new CategoryError("Category not found", "not-found");
        }

        await deleteDoc(docRef);
    }, "Failed to delete category");
};

// ============ BATCH OPERATIONS ============

export const createCategoriesBatch = async (
    categories: Omit<Category, "id" | "createdAt" | "updatedAt">[]
): Promise<string[]> => {
    return handleFirestoreError(async () => {
        if (categories.length === 0) {
            return [];
        }

        if (categories.length > 500) {
            throw new CategoryError("Cannot create more than 500 categories at once");
        }

        const batch = writeBatch(db);
        const colRef = collection(db, COLLECTION_NAME);
        const ids: string[] = [];

        categories.forEach(categoryData => {
            const docRef = doc(colRef); // Auto-generate ID
            ids.push(docRef.id);

            const docData: CategoryDocument = {
                ...categoryData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            batch.set(docRef, docData);
        });

        await batch.commit();
        return ids;
    }, "Failed to create categories in batch");
};

export const updateCategoriesBatch = async (
    updates: { id: string; data: Partial<Omit<Category, "id" | "createdAt">> }[]
): Promise<void> => {
    return handleFirestoreError(async () => {
        if (updates.length === 0) {
            return;
        }

        if (updates.length > 500) {
            throw new CategoryError("Cannot update more than 500 categories at once");
        }

        const batch = writeBatch(db);

        updates.forEach(({ id, data }) => {
            const docRef = doc(db, COLLECTION_NAME, id);
            batch.update(docRef, {
                ...data,
                updatedAt: Timestamp.now()
            });
        });

        await batch.commit();
    }, "Failed to update categories in batch");
};

export const deleteCategoriesBatch = async (ids: string[]): Promise<void> => {
    return handleFirestoreError(async () => {
        if (ids.length === 0) {
            return;
        }

        if (ids.length > 500) {
            throw new CategoryError("Cannot delete more than 500 categories at once");
        }

        const batch = writeBatch(db);

        ids.forEach(id => {
            const docRef = doc(db, COLLECTION_NAME, id);
            batch.delete(docRef);
        });

        await batch.commit();
    }, "Failed to delete categories in batch");
};

// Process in chunks for large batches (>500 items)
export const deleteCategoriesLarge = async (ids: string[]): Promise<void> => {
    const BATCH_SIZE = 500;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const chunk = ids.slice(i, i + BATCH_SIZE);
        await deleteCategoriesBatch(chunk);
    }
};

// ============ REAL-TIME LISTENERS ============

// Listen to all categories
export const subscribeToCategories = (
    onUpdate: (categories: Category[]) => void,
    onError?: (error: CategoryError) => void
): Unsubscribe => {
    const colRef = collection(db, COLLECTION_NAME);

    return onSnapshot(
        colRef,
        (snapshot: QuerySnapshot) => {
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Category[];

            onUpdate(categories);
        },
        (error: FirestoreError) => {
            const categoryError = new CategoryError(
                "Failed to listen to categories",
                error.code,
                error
            );

            if (onError) {
                onError(categoryError);
            } else {
                console.error("Category subscription error:", categoryError);
            }
        }
    );
};

// Listen to a single category
export const subscribeToCategory = (
    id: string,
    onUpdate: (category: Category | null) => void,
    onError?: (error: CategoryError) => void
): Unsubscribe => {
    const docRef = doc(db, COLLECTION_NAME, id);

    return onSnapshot(
        docRef,
        (snapshot: DocumentSnapshot) => {
            if (!snapshot.exists()) {
                onUpdate(null);
                return;
            }

            const category: Category = {
                id: snapshot.id,
                ...snapshot.data()
            } as Category;

            onUpdate(category);
        },
        (error: FirestoreError) => {
            const categoryError = new CategoryError(
                "Failed to listen to category",
                error.code,
                error
            );

            if (onError) {
                onError(categoryError);
            } else {
                console.error("Category subscription error:", categoryError);
            }
        }
    );
};

// Listen to categories with a filter
export const subscribeToCategoriesByBudget = (
    minBudget: number,
    onUpdate: (categories: Category[]) => void,
    onError?: (error: CategoryError) => void
): Unsubscribe => {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(
        colRef,
        where("budget", ">=", minBudget),
        orderBy("budget", "desc")
    );

    return onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Category[];

            onUpdate(categories);
        },
        (error: FirestoreError) => {
            const categoryError = new CategoryError(
                "Failed to listen to filtered categories",
                error.code,
                error
            );

            if (onError) {
                onError(categoryError);
            } else {
                console.error("Category subscription error:", categoryError);
            }
        }
    );
};

// Advanced: Listen with metadata (detect local vs server changes)
export const subscribeToCategoriesToWithMetadata = (
    onUpdate: (categories: Category[], isFromCache: boolean) => void,
    onError?: (error: CategoryError) => void
): Unsubscribe => {
    const colRef = collection(db, COLLECTION_NAME);

    return onSnapshot(
        colRef,
        { includeMetadataChanges: true },
        (snapshot: QuerySnapshot) => {
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Category[];

            // Detect if data is from cache or server
            const isFromCache = snapshot.metadata.fromCache;

            onUpdate(categories, isFromCache);
        },
        (error: FirestoreError) => {
            const categoryError = new CategoryError(
                "Failed to listen to categories",
                error.code,
                error
            );

            if (onError) {
                onError(categoryError);
            } else {
                console.error("Category subscription error:", categoryError);
            }
        }
    );
};

// ============ UTILITY FUNCTIONS ============

// Check if a category exists
export const categoryExists = async (id: string): Promise<boolean> => {
    try {
        const category = await getCategoryById(id);
        return category !== null;
    } catch (error) {
        return false;
    }
};

// Get total budget across all categories
export const getTotalBudget = async (): Promise<number> => {
    const categories = await getCategories();
    return categories.reduce((total, cat) => total + cat.budget, 0);
};

// Duplicate a category
export const duplicateCategory = async (
    id: string,
    newName?: string
): Promise<string> => {
    return handleFirestoreError(async () => {
        const original = await getCategoryById(id);

        if (!original) {
            throw new CategoryError("Original category not found", "not-found");
        }

        const { id: _, createdAt, updatedAt, ...categoryData } = original;

        return await createCategory({
            ...categoryData,
            name: newName || `${original.name} (Copy)`
        });
    }, "Failed to duplicate category");
};