import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { ExpenseForm, type ExpenseFormData } from "./ExpenseForm"
//
type ExpenseEditDialogProps = {
    id: string
    isProcessing?: boolean
    initialData: ExpenseFormData
    title: string
    description: string
    dialogOpen: boolean,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleCancel?: () => void
    handleUpdate: () => void
}

const ExpenseEditDialog = ({
    id,
    title,
    isProcessing = false,
    description,
    initialData,
    dialogOpen,
    setDialogOpen,
    handleCancel,
    handleUpdate,
}: ExpenseEditDialogProps) => {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent id={id}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <ExpenseForm
                    id="form-expense-edit"
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

export { ExpenseEditDialog, type ExpenseEditDialogProps }

