import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ListSkeleton from "@/components/common/ListSkeleton";
import { Button } from "@/components/ui/button";
import useExpenses from "@/hooks/useExpenses";
import { useCategoriesStore } from "@/store/useCategoriesStore";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
// import type { ExpenseFilterState } from "./ExpenseFilter";
// import ExpenseFilter from "./ExpenseFilter";
// import ExpenseListItem from "./ExpenseListItem";
// import type { QueryDocumentSnapshot } from "firebase/firestore";


const ExpensesList = () => {
    const { expenses, pagination, initialLoading, error, filters, refetch } = useExpenses();
    const { categories, loading: categoriesLoading } = useCategoriesStore();

    const [showFilters, setShowFilters] = useState(false);

    const categoryMap = useMemo(() =>
        new Map(categories.map(cat => [cat.id, cat])),
        [categories]
    );
    console.log(categoryMap);

    const activeFilterCount = [
        filters.searchTerm,
        filters.startDate,
        filters.endDate,
        filters.minAmount,
        filters.maxAmount
    ].filter(Boolean).length;

    if (initialLoading || categoriesLoading)
        return <ListSkeleton count={5} className="mt-2" />

    if (!initialLoading && error)
        return <ErrorState error={error} onRetry={refetch} />

    if (!initialLoading && !error && expenses.length === 0)
        return <EmptyState
            title="No expenses yet"
            description="Get started by creating your first expense." />

    return (
        <div className="space-y-4">
            {/* Filter Component */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {expenses.length} of {pagination.totalCount} expenses
                </div>

                {/* Filter Toggle Button */}
                <div className="flex items-center justify-end">
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Filter size={18} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-background text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

            </div>
            <div className="shrink-0">
                {/* <ExpenseFilter
                    filters={filters}
                    setFilters={setFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    categories={categories}
                    activeFilterCount={activeFilterCount}
                /> */}
            </div>

            {/* Expenses List */}
            {/* {displayedExpenses.length === 0 ? (
                <EmptyState
                    title="No expenses match your filters"
                    description="Try adjusting your filter criteria."
                />
            ) : (
                <div className="space-y-2">
                    {displayedExpenses.map((expense) => {
                        const category = categoryMap.get(expense.categoryId || '');
                        return (
                            <ExpenseListItem
                                key={expense.id}
                                expense={expense}
                                category={category}
                            />
                        )
                    })}
                </div>
            )} */}

            {/* Load More Button */}
            {/* {hasMore && (
                <div className="text-center pt-4">
                    <button
                        onClick={() => setItemsToShow(prev => prev + ITEMS_PER_PAGE)}
                        className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors inline-flex items-center gap-2"
                    >
                        Load More ({filteredAndSortedExpenses.length - itemsToShow} remaining)
                        <ChevronDown size={18} />
                    </button>
                </div>
            )} */}
        </div>
    )
};

export default ExpensesList;