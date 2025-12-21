import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { ExpenseForm, type ExpenseFormData } from './ExpenseForm';

const Expense = () => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [expenses, setExpenses] = useState([
        { description: 'Grocery shopping', amount: 85.50, categoryId: 'Food', date: '12/15', color: 'red' },
        { description: 'Gas station', amount: 45.00, categoryId: 'Transport', date: '12/14', color: 'blue' },
        { description: 'Movie tickets', amount: 32.00, categoryId: 'Entertainment', date: '12/13', color: 'purple' },
        { description: 'Internet bill', amount: 60.00, categoryId: 'Bills', date: '12/12', color: 'green' },
        { description: 'Restaurant dinner', amount: 78.20, categoryId: 'Food', date: '12/11', color: 'red' }
    ]);

    const handleCreate = (data: ExpenseFormData) => {
        console.log(data);
        toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
            },
        })
    }

    // Handle Update
    const handleUpdate = (data: ExpenseFormData) => {
        console.log(data)
        setEditingId(null);
        toast.success("Expense updated!");
    };

    const handleDelete = (expenseId: number) => {
        console.log(expenseId)
        // setCategories(filteredCategories);
        toast.success("Expense updated!");
        setExpenses([]);

    }

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Card className="w-full md:max-w-md rounded-md">
                <CardHeader>
                    <CardTitle>Add New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                    <ExpenseForm id="form-expense" onSubmit={handleCreate} buttonLabel="Save" />
                </CardContent>
            </Card>

            <Card className="w-full rounded-md md:max-w-2xl">
                <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {expenses.map((exp, idx) => (
                            editingId === idx ? (
                                <div
                                    key={`edit-${idx}`}
                                    className='overflow-hidden border border-solid border-border rounded p-3'>
                                    <ExpenseForm id="form-expense-edit"
                                        initialData={exp}
                                        onSubmit={handleUpdate}
                                        onCancel={() => setEditingId(null)}
                                        buttonLabel="Update" />
                                </div>
                            ) :
                                (<div
                                    key={`edit-${idx}`}
                                    className="flex flex-row border border-solid border-border rounded p-3">

                                    <div className="flex flex-col flex-1">
                                        <div className="font-semibold text-left text-sm">{exp.description}</div>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className={`flex items-center justify-center text-xs px-2 py-0.5 rounded bg-amber-300 text-amber-50`}>
                                                {/* {exp.category} */}Category
                                            </span>
                                            <span className="text-xs text-muted-foreground">{exp.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold px-3">${exp.amount}</div>
                                        <div className="text-xs text-muted-foreground cursor-pointer">
                                            <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => setEditingId(idx)}>
                                                Edit
                                            </Button>
                                            <ConfirmDialog
                                                title={`Delete ${exp.description}?`}
                                                onConfirm={() => handleDelete(idx)}
                                                trigger={
                                                    <Button className="cursor-pointer" variant="ghost" size="sm">
                                                        Delete
                                                    </Button>
                                                }
                                            />

                                        </div>
                                    </div>
                                </div>)
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default Expense
