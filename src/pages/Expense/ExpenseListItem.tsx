import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CURRENCY } from '@/constants';
import { formatTimestamp, getRandomColorName } from '@/lib/utils';
import * as services from '@/services/db';
import { memo, useState } from 'react';
import { toast } from 'sonner';
import { getCategoryColor } from '../../lib/utils';
import { ExpenseEditDialog } from './ExpenseEditDialog';
import type { ExpenseFormData } from './ExpenseForm';

interface ExpenseListItemProps {
    expense: services.WithId<services.ExpenseFields>;
    category: services.WithId<services.CategoryFields> | undefined;
}

const parseInitialData = (data: services.WithId<services.ExpenseFields>): ExpenseFormData => {
    return {
        amount: data.amount ? String(data.amount) : "",
        description: data.description || "",
        categoryId: data.categoryId || "",
    }
}

const CategoryListItem = memo<ExpenseListItemProps>(({
    expense,
    category
}) => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const categoryColor = category?.color ? getCategoryColor(category.color) : getCategoryColor(getRandomColorName());

    const handleUpdate = (data: ExpenseFormData, editingId: string) => {
        console.log(data)
        return
        if (!editingId || isProcessing) return;

        setIsProcessing(true);

        const categoryData = {
            ...data,
            amount: data.amount ? Number(data.amount) : undefined,
        }

        services.expenseService.update(editingId, categoryData)
            .then(() => {
                toast.success("Category updated successfully");
                setDialogOpen(false);
            })
            .catch((error) => {
                toast.error(`Error updating category: ${error.message}`);
            }).finally(() => { setIsProcessing(false); });
    };

    const handleDelete = (expenseId: string) => {
        if (!expenseId || isProcessing) return;

        setIsProcessing(true);

        services.expenseService.delete(expenseId)
            .then(() => {
                toast.success("Expense deleted successfully");
            })
            .catch((error) => {
                toast.error(`Error deleting expense: ${error.message}`);
            }).finally(() => { setIsProcessing(false); });
    }

    return (
        <div
            className="flex flex-row border border-solid border-border rounded p-3">

            <div className="flex flex-col gap-1 justify-center flex-1">
                <div className="font-semibold text-left text-sm">{expense.description}</div>
                <div className="flex gap-2 items-center mt-1">
                    <span className={`flex items-center justify-center text-xs px-2 py-0.5 rounded text-secondary`} style={{ backgroundColor: categoryColor }}>
                        {category?.name || 'Other'}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(expense.createdAt)}</span>
                </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
                <div className="font-bold px-3">{CURRENCY} {expense.amount}</div>
                <div className="text-muted-foreground cursor-pointer">
                    <Button
                        className="cursor-pointer text-xs"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={dialogOpen}
                        aria-controls={`edit-category-dialog-${expense.id}`}
                    >
                        Edit
                    </Button>
                    <ConfirmDialog
                        title={`Delete ${expense.description}?`}
                        onConfirm={() => handleDelete(expense.id)}
                        trigger={
                            <Button className="cursor-pointer text-xs" variant="ghost" size="sm" aria-haspopup="dialog"
                                disabled={isProcessing}>
                                {isProcessing && <Spinner />}
                                Delete
                            </Button>
                        }
                    />

                </div>
            </div>

            {dialogOpen && <ExpenseEditDialog
                id={`edit-expense-dialog-${expense.id}`}
                isProcessing={isProcessing}
                title={`Edit: ${expense.description}`}
                description={"Edit expense details"}
                initialData={parseInitialData(expense)}
                dialogOpen={true}
                setDialogOpen={setDialogOpen}
                handleUpdate={() => handleUpdate(parseInitialData(expense), expense.id)}
                handleCancel={() => setDialogOpen(false)}
            />}
        </div>
    )
});

export default CategoryListItem;