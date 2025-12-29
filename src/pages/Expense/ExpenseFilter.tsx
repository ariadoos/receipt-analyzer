import { Filter, Search, X } from 'lucide-react';
import { type FormEvent, useRef } from 'react';
import * as services from '@/services/db';

interface ExpenseFilterProps {
    filters: services.ExpensesFilterState;
    setFilters: (filters: services.ExpensesFilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    categories: Array<{ id: string; name: string; }>;
    activeFilterCount: number;
}

const ExpenseFilter = ({
    filters: initialFilters,
    setFilters,
    showFilters,
    setShowFilters,
    categories,
    activeFilterCount,
}: ExpenseFilterProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    console.log(categories);
    console.log(activeFilterCount);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Use FormData API to extract all values
        const formData = new FormData(e.currentTarget);

        const filters: services.ExpensesFilterState = {
            searchTerm: formData.get('search') as string || '',
            minAmount: formData.get('amountMin') as string || '',
            maxAmount: formData.get('amountMax') as string || '',
            startDate: null,
            endDate: null,
        };

        setFilters(filters);
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setFilters({
            searchTerm: '',
            minAmount: null,
            maxAmount: null,
            startDate: null,
            endDate: null,
        })
        formRef.current?.reset();
    };

    const handleCancel = () => {
        formRef.current?.reset();
        setShowFilters(false);
    };

    return (
        <div className="space-y-4">
            {showFilters && (
                <div className="border-2 border-primary/20 rounded-lg bg-card shadow-lg overflow-hidden">
                    <div className="p-4 border-b bg-muted/50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Filter size={18} />
                                Filter Expenses
                            </h3>
                            <button onClick={handleCancel} className="hover:bg-muted p-1 rounded">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Search - name attribute for FormData */}
                        <div>
                            <label className="text-xs font-semibold block mb-1">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search expense description"
                                    defaultValue={initialFilters.searchTerm}
                                    className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Amount Range */}
                        <div>
                            <label className="text-xs font-semibold block mb-1">Amount Range</label>
                            <div className="flex gap-2">
                                <input
                                    name="amountMin"
                                    type="number"
                                    placeholder="Min"
                                    defaultValue={initialFilters.minAmount ?? ''}
                                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <span className="self-center text-muted-foreground">to</span>
                                <input
                                    name="amountMax"
                                    type="number"
                                    placeholder="Max"
                                    defaultValue={initialFilters.maxAmount ?? ''}
                                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="flex-1 px-3 py-2 border rounded font-semibold hover:bg-muted transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-3 py-2 border rounded font-semibold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ExpenseFilter;