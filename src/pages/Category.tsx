import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { CategoryForm, type CategoryFormData } from './CategoryForm';

const Category = () => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Food & Dining', budget: 600, spent: 450, color: 'Red' },
        { id: 2, name: 'Transportation', budget: 400, spent: 280, color: 'blue' },
        { id: 3, name: 'Entertainment', budget: 300, spent: 180, color: 'purple' },
        { id: 4, name: 'Bills & Utilities', budget: 500, spent: 330, color: 'green' },
        { id: 5, name: 'Shopping', budget: 200, spent: 0, color: 'yellow' }
    ]);

    const handleCreate = (data: CategoryFormData) => {
        console.log(data);
    }

    // Handle Update
    const handleUpdate = (data: CategoryFormData) => {
        setCategories(prev => prev.map(cat =>
            cat.id === editingId ? { ...cat, ...data, budget: Number(data.budget) } : cat
        ));
        setEditingId(null);
        toast.success("Category updated!");
    };

    const handleDelete = (categoryId: number) => {
        const filteredCategories = categories.filter((category) => category.id !== categoryId);
        setCategories(filteredCategories);
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Card className="w-full md:max-w-md rounded-md">
                <CardHeader>
                    <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryForm id="form-category" onSubmit={handleCreate} buttonLabel="Save" />
                </CardContent>
            </Card>

            <Card className="w-full rounded-md md:max-w-2xl">
                <CardHeader>
                    <CardTitle>Your Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <AnimatePresence key={cat.id} mode="wait">
                                {
                                    editingId === cat.id ? (
                                        <motion.div
                                            key={`edit-${cat.id}`}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{
                                                duration: 0.3
                                            }}
                                            className='overflow-hidden border border-solid border-border rounded p-3'>
                                            <CategoryForm id="form-category-edit"
                                                initialData={cat}
                                                onSubmit={handleUpdate}
                                                onCancel={() => setEditingId(null)}
                                                buttonLabel="Update" />
                                        </motion.div>
                                    ) :
                                        (<motion.div
                                            key={`view-${cat.name}`}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{
                                                duration: 0.3
                                            }}
                                            className="border border-solid border-border rounded p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded ${cat.color}`}></div>
                                                    <span className="font-semibold">{cat.name}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground cursor-pointer">
                                                    <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => setEditingId(cat.id)}>
                                                        Edit
                                                    </Button>
                                                    <ConfirmDialog
                                                        title={`Delete ${cat.name}?`}
                                                        onConfirm={() => handleDelete(cat.id)}
                                                        trigger={
                                                            <Button className="cursor-pointer" variant="ghost" size="sm">
                                                                Delete
                                                            </Button>
                                                        }
                                                    />

                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className={cat.spent > cat.budget * 0.8 ? 'text-red-600 font-semibold' : 'text-card-foreground'}>
                                                    Spent: ${cat.spent}
                                                </span>
                                                <span className="text-muted-foreground">Budget: ${cat.budget}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%` }}></div>
                                            </div>
                                        </motion.div>)
                                }
                            </AnimatePresence>

                        ))}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default Category
