import { FirestoreServiceError } from '@/lib/dbErrors';
import { useExpensesStore } from '@/store/useExpensesStore';
import { useState } from 'react';
import { toast } from 'sonner';
import { ExpenseForm, type ExpenseFormData } from './ExpenseForm';

const ExpenseCreate = () => {
    const userId = 1;
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { addExpense } = useExpensesStore();

    const handleCreate = async (data: ExpenseFormData, resetForm?: () => void) => {
        if (isProcessing) return;

        setIsProcessing(true);

        const expenseData = {
            ...data,
            amount: Number(data.amount),
            userId: userId
        }

        try {
            await addExpense(expenseData);
            toast.success("Expense added successfully");
            resetForm?.();
        } catch (error: unknown) {
            if (error instanceof FirestoreServiceError) {
                toast.error(`Error adding expense: ${error.message}`);
            } else {
                toast.error("An unexpected error occurred while creating the expense");
            }
        } finally {
            setIsProcessing(false);
        }
    }

    return <ExpenseForm id="form-expenses" onSubmit={handleCreate} buttonLabel="Save" isProcessing={isProcessing} />
}

export default ExpenseCreate;