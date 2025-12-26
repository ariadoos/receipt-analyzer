import { SearchableDropdown, type Option } from "@/components/common/SearchableDropdown";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { CURRENCY } from "@/constants/currency";
import { getRandomColorName } from "@/lib/utils";
import { useCategoriesStore } from "@/store/useCategoriesStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from 'zod';

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseFormProps {
    id: string;
    initialData?: ExpenseFormData;
    isProcessing?: boolean;
    onSubmit: (data: ExpenseFormData, resetForm: () => void) => void;
    onCancel?: () => void;
    buttonLabel?: string;
}

const formSchema = z.object({
    amount: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Must be a valid number"
        ),
    description: z
        .string()
        .min(1, "Description is required.")
        .max(50, "Description must be at least 50 character."),
    categoryId: z.string().optional(),
})

const ExpenseForm = ({
    id,
    initialData,
    onSubmit,
    onCancel,
    buttonLabel = "Save",
    isProcessing = false
}: ExpenseFormProps) => {
    const userId = 1;
    const { categories, loading: isLoading, addCategory } = useCategoriesStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            amount: String(initialData.amount) // Ensure number becomes string for input
        } : {
            amount: "",
            description: "",
            categoryId: '',
        },
    });

    const safeCategories = useMemo(() => {
        return isLoading ? [] : categories.map((cat) => ({ id: cat.id, name: cat.name })) ?? [];
    }, [isLoading, categories])


    const handleSubmitForm = (data: ExpenseFormData) => {
        onSubmit(data, form.reset);
    };

    const handleCreateOption = async (newOption: Option) => {
        try {
            // Save to DB
            const categoryData = {
                name: newOption.name,
                color: getRandomColorName(),
                userId: userId
            }
            const categoryId = await addCategory(categoryData);
            return categoryId;

        } catch (error) {
            // Rollback on error
            console.error('Failed to create option:', error);
            throw error;
        }
    };

    return (
        <form id={id} onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4" >
            <FieldGroup>
                {/* Amount Field */}
                <Controller
                    name="amount"
                    control={form.control} render={({ field, fieldState }) =>
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-amount`}>
                                Amount {CURRENCY}
                            </FieldLabel>
                            <Input
                                {...field}
                                id={`${id}-amount`}
                                aria-invalid={fieldState.invalid}
                                placeholder={`20`}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError className='text-left' errors={[fieldState.error]} />
                            )}
                        </Field>
                    }
                />

                {/* Description Field */}
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-description`}>
                                Description
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id={`${id}-description`}
                                    placeholder="Groceries"
                                    className="resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value?.length ?? 0}/50 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError className='text-left' errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Category Dropdown */}
                <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field, fieldState }) =>
                    (

                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-category-id`}>
                                Category
                            </FieldLabel>
                            <SearchableDropdown
                                {...field}
                                options={safeCategories}
                                id={`${id}-category-id`}
                                placeholder="Select category"
                                isLoading={isLoading}
                                aria-invalid={fieldState.invalid}
                                onCreateOption={handleCreateOption}
                                value={field.value || ''}
                                onChange={field.onChange}
                            />
                            {fieldState.invalid && (
                                <FieldError className='text-left' errors={[fieldState.error]} />
                            )}
                        </Field>
                    )
                    }
                />
            </FieldGroup>

            <div className="flex justify-end gap-2 pt-2">
                <Field orientation="horizontal">
                    {onCancel && (
                        <Button className="cursor-pointer" type="button" variant="outline" disabled={isProcessing} onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    {!onCancel && (
                        <Button className="cursor-pointer" type="button" variant="outline" disabled={isProcessing} onClick={() => form.reset()}>
                            Reset
                        </Button>
                    )}
                    <Button className="cursor-pointer" type="submit" form={id} disabled={isProcessing}>
                        {isProcessing && <Spinner />}
                        {buttonLabel}
                    </Button>
                </Field>
            </div>
        </form >
    );
};

export { ExpenseForm, type ExpenseFormData };

