import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { CategoryForm, type CategoryFormData } from "./CategoryForm"

type CategoryEditDialogProps = {
    id: string
    isProcessing?: boolean
    initialData: CategoryFormData
    title: string
    description: string
    dialogOpen: boolean,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleCancel?: () => void
    handleUpdate: () => void
}

const CategoryEditDialog = ({
    id,
    title,
    isProcessing = false,
    description,
    initialData,
    dialogOpen,
    setDialogOpen,
    handleCancel,
    handleUpdate,
}: CategoryEditDialogProps) => {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent id={id}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <CategoryForm
                    id="form-category-edit"
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    onCancel={handleCancel}
                    buttonLabel="Update"
                    isProcessing={isProcessing}
                />
            </DialogContent>
        </Dialog>
    )
}

export { CategoryEditDialog, type CategoryEditDialogProps }

