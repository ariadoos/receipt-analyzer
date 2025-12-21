import type { FirestoreError } from "firebase/firestore";

export class FirestoreServiceError extends Error {
    code: string | undefined;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
    }
}

/**
 * A helper to turn technical Firebase codes into friendly messages.
 */
const getErrorMessage = (code: string): string => {
    let message;

    switch (code) {
        case "permission-denied":
            message = "You don't have permission to perform this action";
            break;
        case "not-found":
            message = `Document not found`;
            break;
        case "already-exists":
            message = "Document already exists";
            break;
        case "unavailable":
            message = "Service temporarily unavailable. Please try again";
            break;
        case "unauthenticated":
            message = "Please sign in to continue";
            break;
        case "failed-precondition":
            message = "Operation failed. Please check your data and try again";
            break;
        case "resource-exhausted":
            message = "Too many requests. Please try again later";
            break;
        case "cancelled":
            message = "Operation was cancelled";
            break;
        case "deadline-exceeded":
            message = "Operation took too long. Please try again";
            break;
        default:
            message = "An unexpected database error occurred.";
            break;
    };

    return message;
}

export const handleFirestoreError = async <T>(
    operation: () => Promise<T>,
    context: string
): Promise<T> => {
    try {
        return await operation();
    } catch (error: unknown) {
        if (import.meta.env.MODE === "development") {
            console.error("Detail error", error);
        }

        const isFirestoreError = error instanceof Error && "code" in error;
        const errorCode = isFirestoreError ? (error as FirestoreError).code : "unknown";

        const errorMessage = getErrorMessage(errorCode);

        throw new FirestoreServiceError(
            `${context}: ${errorMessage}`,
            errorCode
        );
    }
};