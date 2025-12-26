import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ListSkeleton from "@/components/common/ListSkeleton";
import useExpenses from "@/hooks/useExpenses";
import { useCategoriesStore } from "@/store/useCategoriesStore";
import { useMemo } from "react";
import ExpenseListItem from "./ExpenseListItem";

const ExpensesList = () => {
    const userId = 1;
    const { expenses, isLoading, error, refetch } = useExpenses(userId);
    const { categories, loading: categoriesLoading } = useCategoriesStore();

    const categoryMap = useMemo(() =>
        new Map(categories.map(cat => [cat.id, cat])),
        [categories]
    );

    if (isLoading || categoriesLoading)
        return <ListSkeleton count={5} className="mt-2" />

    if (!isLoading && error)
        return <ErrorState error={error} onRetry={refetch} />

    if (!isLoading && !error && expenses.length === 0)
        return <EmptyState
            title="No expenses yet"
            description="Get started by creating your first expense." />

    return (
        <div className="space-y-2">
            {expenses.map((expense) => {
                const category = categoryMap.get(expense.categoryId || '');
                return (
                    <ExpenseListItem key={expense.id} expense={expense} category={category}></ExpenseListItem>
                )
            }
            )}
        </div>
    )
};

export default ExpensesList;