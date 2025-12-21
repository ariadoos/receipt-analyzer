import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { CURRENCY } from "@/constants/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from 'zod';

export interface ExpenseBackend {
    id: number;
    amount: number; // Backend sends a number
    categoryId: string
    description: string;
}

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseFormProps {
    id: string;
    initialData?: ExpenseFormData; // REMOVE ANY
    onSubmit: (data: ExpenseFormData) => void;
    onCancel?: () => void;
    buttonLabel?: string;
}

const formSchema = z.object({
    categoryId: z
        .string()
        .optional(),
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Must be a valid number"
        ),
    description: z
        .string()
        .min(1, "Description must contain some character.")
        .max(50, "Description must be at least 50 character.")
})

const ExpenseForm = ({ id, initialData, onSubmit, onCancel, buttonLabel = "Save" }: ExpenseFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            amount: String(initialData.amount) // Ensure number becomes string for input
        } : {
            categoryId: "",
            amount: "",
            description: ""
        },
    });

    return (
        <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
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
            </FieldGroup>

            <div className="flex justify-end gap-2 pt-2">
                <Field orientation="horizontal">
                    {onCancel && (
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    {!onCancel && (
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                    )}
                    <Button className="cursor-pointer" type="submit" form={id}>{buttonLabel}</Button>
                </Field>
            </div>
        </form >
    );
};

export { ExpenseForm, type ExpenseFormData };

