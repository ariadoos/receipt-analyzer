import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CURRENCY } from '@/constants';
import { COLORS } from '@/constants/colors';
import * as services from '@/services/db';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { memo, useState } from 'react';
import { toast } from 'sonner';
import { CategoryEditDialog } from './CategoryEditDialog';
import { type CategoryFormData } from "./CategoryForm";

interface CategoryListItemProps {
    category: services.WithId<services.CategoryFields>;
}

const parseInitialData = (data: services.WithId<services.CategoryFields>): CategoryFormData => {
    return {
        name: data.name,
        budget: data.budget ? String(data.budget) : "",
        color: data.color || "",
        description: data.description || ""
    }
}

const COLOR_MAP = new Map(COLORS.map(c => [c.name, c.value]));

const CategoryListItem = memo<CategoryListItemProps>(({
    category
}) => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const { updateCategory, deleteCategory } = useCategoriesStore();

    const handleUpdate = (data: CategoryFormData, editingId: string) => {
        if (!editingId || isProcessing) return;

        setIsProcessing(true);

        const categoryData = {
            ...data,
            budget: data.budget ? Number(data.budget) : undefined,
        }

        updateCategory(editingId, categoryData)
            .then(() => {
                toast.success("Category updated successfully");
                setDialogOpen(false);
            })
            .catch((error) => {
                toast.error(`Error updating category: ${error.message}`);
            }).finally(() => { setIsProcessing(false); });
    };

    const handleDelete = (categoryId: string) => {
        if (!categoryId || isProcessing) return;

        setIsProcessing(true);

        deleteCategory(categoryId)
            .then(() => {
                toast.success("Category deleted successfully");
            })
            .catch((error) => {
                toast.error(`Error deleting category: ${error.message}`);
            }).finally(() => { setIsProcessing(false); });
    }

    return (
        <div
            className="border border-solid border-border rounded p-3"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded"
                        style={{
                            backgroundColor: COLOR_MAP.get(category.color || '') || 'transparent'
                        }}
                    ></div>
                    <span className="font-semibold">{category.name}</span>
                </div>
                <div className="text-xs text-muted-foreground cursor-pointer">
                    <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={dialogOpen}
                        aria-controls={`edit-category-dialog-${category.id}`}
                    >
                        Edit
                    </Button>

                    <ConfirmDialog
                        title={`Delete ${category.name}?`}
                        onConfirm={() => handleDelete(category.id)}
                        trigger={
                            <Button
                                className="cursor-pointer"
                                variant="ghost"
                                size="sm"
                                aria-haspopup="dialog"
                                disabled={isProcessing}
                            >
                                {isProcessing && <Spinner />}
                                Delete
                            </Button>
                        }
                    />
                </div>
            </div>
            <div className="flex justify-between text-sm mb-1">
                {category.budget ? (
                    <span>Budget: {CURRENCY} {category.budget}</span>
                ) : (
                    <span className="text-muted-foreground">No budget set</span>
                )}
            </div>

            {dialogOpen && <CategoryEditDialog
                id={`edit-category-dialog-${category.id}`}
                isProcessing={isProcessing}
                title={`Edit: ${category.name}`}
                description={"Edit category details"}
                initialData={parseInitialData(category)}
                dialogOpen={true}
                setDialogOpen={setDialogOpen}
                handleUpdate={() => handleUpdate(parseInitialData(category), category.id)}
                handleCancel={() => setDialogOpen(false)}
            />}
        </div>
    )
});

export default CategoryListItem;