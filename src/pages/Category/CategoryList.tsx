import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ListSkeleton from "@/components/common/ListSkeleton";
import useCategories from "@/hooks/useCategories";
import CategoryListItem from "./CategoryListItem";

const CategoryList = () => {
    const userId = 1;
    const { categories, isLoading, error, refetch } = useCategories(userId);

    if (isLoading)
        return <ListSkeleton count={5} className="mt-2" />

    if (!isLoading && error)
        return <ErrorState error={error} onRetry={refetch} />

    if (!isLoading && !error && categories.length === 0)
        return <EmptyState
            title="No categories yet"
            description="Get started by creating your first category to organize your expenses." />

    return (
        <div className="space-y-2">
            {categories.map((cat) => (
                <CategoryListItem key={cat.id} category={cat}></CategoryListItem>
            )
            )}
        </div>
    )
};

export default CategoryList;