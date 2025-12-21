import * as services from '@/services/db';
import { toast } from 'sonner';
import { CategoryForm, type CategoryFormData } from './CategoryForm';
import { useState } from 'react';
import { FirestoreServiceError } from '@/lib/dbErrors';

const CategoryCreate = () => {
    const userId = 1;
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleCreate = async (data: CategoryFormData, resetForm: () => void) => {
        if (isProcessing) return;

        setIsProcessing(true);

        const categoryData = {
            ...data,
            budget: data.budget ? Number(data.budget) : undefined,
            userId: userId
        }

        try {
            await services.categoryService.create(categoryData);
            toast.success("Category created successfully");
            resetForm();
        } catch (error: unknown) {
            if (error instanceof FirestoreServiceError) {
                toast.error(`Error creating category: ${error.message}`);
            } else {
                toast.error("An unexpected error occurred while creating the category");
            }
            setIsProcessing(false);
        }
    }

    return <CategoryForm id="form-category" onSubmit={handleCreate} buttonLabel="Save" isProcessing={isProcessing} />
}

export default CategoryCreate;