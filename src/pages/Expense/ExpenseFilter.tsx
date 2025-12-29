import { Filter, Search, X } from 'lucide-react';

export interface ExpenseFilterState {
    searchQuery: string;
    dateRange: 'all' | 'today' | 'week' | 'month' | 'last-month';
    categories: string[];
    amountMin: string;
    amountMax: string;
    sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'merchant';
}

interface ExpenseFilterProps {
    filters: ExpenseFilterState;
    setFilters: (filters: ExpenseFilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    categories: Array<{ id: string; name: string; }>;
    activeFilterCount: number;
}

const ExpenseFilter = ({
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    categories,
}: ExpenseFilterProps) => {

    const handleClearFilters = () => {
        setFilters({
            dateRange: 'all',
            categories: [],
            amountMin: '',
            amountMax: '',
            searchQuery: '',
            sortBy: 'date-desc'
        });
    };

    const handleCategoryToggle = (categoryName: string, checked: boolean) => {
        if (checked) {
            setFilters({ ...filters, categories: [...filters.categories, categoryName] });
        } else {
            setFilters({ ...filters, categories: filters.categories.filter(c => c !== categoryName) });
        }
    };

    return (
        <div className="space-y-4">
            {/* Accordion-style Filter Panel */}
            {showFilters && (
                <div className="border-2 border-primary/20 rounded-lg bg-card shadow-lg overflow-hidden">
                    <div className="p-4 border-b bg-muted/50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Filter size={18} />
                                Filter Expenses
                            </h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="hover:bg-muted p-1 rounded"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Search */}
                        <div>
                            <label className="text-xs font-semibold block mb-1">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search description or category..."
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="text-xs font-semibold block mb-1">
                                Date Range
                            </label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as ExpenseFilterState['dateRange'] })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="last-month">Last Month</option>
                            </select>
                        </div>

                        {/* Categories */}
                        {categories.length > 0 && (
                            <div>
                                <label className="text-xs font-semibold block mb-2">
                                    Categories
                                </label>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(cat.name)}
                                                onChange={(e) => handleCategoryToggle(cat.name, e.target.checked)}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amount Range */}
                        <div>
                            <label className="text-xs font-semibold block mb-1">
                                Amount Range
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.amountMin}
                                    onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <span className="self-center text-muted-foreground">to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.amountMax}
                                    onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="text-xs font-semibold block mb-1">
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as ExpenseFilterState['sortBy'] })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="date-desc">Date (Newest)</option>
                                <option value="date-asc">Date (Oldest)</option>
                                <option value="amount-desc">Amount (High to Low)</option>
                                <option value="amount-asc">Amount (Low to High)</option>
                                <option value="merchant">Description (A-Z)</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleClearFilters}
                                className="flex-1 px-3 py-2 border rounded font-semibold hover:bg-muted transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseFilter;