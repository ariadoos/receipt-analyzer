import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { COLORS } from "@/constants/colors";
import { CURRENCY } from "@/constants/currency";
import { getRandomColorName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';

type CategoryFormData = z.infer<typeof formSchema>
interface CategoryFormProps {
    id: string;
    initialData?: CategoryFormData;
    isProcessing?: boolean;
    onSubmit: (data: CategoryFormData, resetForm: () => void) => void;
    onCancel?: () => void;
    buttonLabel?: string;
}

const formSchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 character.")
        .max(50, "Category name must be at least 50 character."),
    budget: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Must be a valid number"
        ),
    color: z.string().min(1, "Please select a color"),
    description: z
        .string()
        .max(100, "Description must be at least 100 character.")
        .optional()
})

const CategoryForm = ({
    id,
    initialData,
    onSubmit,
    onCancel,
    buttonLabel = "Save",
    isProcessing = false
}: CategoryFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            budget: String(initialData.budget) // Ensure number becomes string for input
        } : {
            name: "",
            budget: "",
            color: getRandomColorName(),
            description: ""
        },
    });

    const handleSubmitForm = (data: CategoryFormData) => {
        onSubmit(data, form.reset);
    };

    return (
        <form id={id} onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4" >
            <FieldGroup>
                {/* Name Field */}
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-title`}>
                                Category
                            </FieldLabel>
                            <Input
                                {...field}
                                placeholder="Groceries"
                                className="placeholder:text-input"
                                id={`${id}-title`}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off" />
                            {fieldState.invalid && <FieldError className="text-left" errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Budget Field */}
                <Controller
                    name="budget"
                    control={form.control} render={({ field, fieldState }) =>
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-budget`}>
                                Budget limit {CURRENCY}
                            </FieldLabel>
                            <Input
                                {...field}
                                id={`${id}-budget`}
                                aria-invalid={fieldState.invalid}
                                className="placeholder:text-input"
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
                                    placeholder="Groceries items bought from ..."
                                    rows={6}
                                    className="min-h-24 resize-none placeholder:text-input"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value?.length ?? 0}/100 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError className='text-left' errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Color Field */}
                <Controller
                    name="color"
                    control={form.control}
                    render={({ field, fieldState }) => {
                        const selectedColor = COLORS.find((color) => color.name === field.value)

                        return (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`${id}-color`}>
                                    Color
                                </FieldLabel>
                                <div role="radiogroup" aria-labelledby={`${id}-color`} className="grid grid-cols-9 gap-2">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => field.onChange(color.name)}
                                            role="radio"
                                            aria-checked={color.name === selectedColor?.name}
                                            className="relative w-6 h-6 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 cursor-pointer"
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                            aria-label={color.name}
                                        >
                                            {field.value === color.name && (
                                                <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected color preview */}
                                {selectedColor && (
                                    <div className="mt-2 flex items-center gap-2 p-2 bg-accent rounded">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: selectedColor.value }}
                                        />
                                        <span className="text-sm text-card-foreground">{selectedColor.name}</span>
                                    </div>
                                )}

                                {fieldState.invalid && (
                                    <FieldError className='text-left' errors={[fieldState.error]} />
                                )}
                            </Field>
                        )
                    }}
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

export { CategoryForm, type CategoryFormData };
