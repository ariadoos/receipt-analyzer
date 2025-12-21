import * as services from '@/services/db';
import { toast } from 'sonner';
import { CategoryForm, type CategoryFormData } from './CategoryForm';
import { useState } from 'react';

const CategoryCreate = () => {
    const userId = 1;
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleCreate = (data: CategoryFormData, resetForm: () => void) => {
        if (isProcessing) return;

        setIsProcessing(true);

        const categoryData = {
            ...data,
            budget: data.budget ? Number(data.budget) : undefined,
            userId: userId
        }

        services.categoryService.create(categoryData)
            .then(() => {
                toast.success("Category created successfully");
                resetForm();
            })
            .catch((error) => {
                toast.error(`Error creating category: ${error.message}`);
            }).finally(() => {
                setIsProcessing(false);
            });
    }

    return <CategoryForm id="form-category" onSubmit={handleCreate} buttonLabel="Save" isProcessing={isProcessing} />
}

export default CategoryCreate;