
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Plus, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Option {
    id: string;
    name: string;
}

interface SearchableDropdownProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    id?: string;
    options?: Option[];
    placeholder?: string;
    onChange?: (id: string) => void;
    onCreateOption?: (option: Option) => Promise<string>;
    value: string;
    className?: string;
    isLoading?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options = [],
    placeholder = "Search or create...",
    onChange,
    onCreateOption,
    value = '',
    className = '',
    id,
    disabled,
    isLoading = false,
    ...inputProps
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>(value);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const getDisplayValue = (): string => {
        if (!selectedValue) return '';
        const selected = options.find(opt => opt.id === selectedValue);
        return selected ? selected.name : '';
    };

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions: Option[] = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    const showCreateOption: boolean = search.trim() !== '' &&
        !filteredOptions.some(opt => opt.name.toLowerCase() === search.toLowerCase());

    const handleSelect = (option: Option): void => {
        setSelectedValue(option.id);
        setSearch('');
        setIsOpen(false);
        onChange?.(option.id);
    };

    const handleCreate = async (): Promise<void> => {
        if (!onCreateOption) return;

        const newOption: Option = {
            id: '', // Will be set by DB
            name: search.trim()
        };

        setIsCreating(true);
        try {
            const savedId = await onCreateOption(newOption);
            if (!savedId) return

            handleSelect({
                ...newOption,
                id: savedId
            });
        } catch (error) {
            console.error('Failed to create option:', error);
            toast.error('Failed to create option. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleInputClick = (): void => {
        if (disabled || isLoading) return;

        setIsOpen(true);
        inputRef.current?.focus();
    };

    return (
        <div className="w-full max-w-md mx-auto" ref={dropdownRef}>
            <div className="relative">
                <div
                    className="flex items-center gap-2 relative"
                    onClick={handleInputClick}
                >
                    <div className={`absolute left-3 pointer-events-none ${disabled ? 'opacity-50' : ''}`}>
                        {
                            isLoading ? <div className="w-4 h-4"><Spinner className="w-4 h-4 text-muted-foreground" /></div> : <Search className="w-4 h-4 text-muted-foreground" />
                        }
                    </div>
                    <input
                        ref={inputRef}
                        id={id}
                        type="text"
                        value={isOpen ? search : getDisplayValue()}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        className={cn('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pl-9 pr-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className)}
                        disabled={disabled}
                        autoComplete='off'
                        {...inputProps}
                    />
                    <div className={`absolute right-3 pointer-events-none ${disabled ? 'opacity-50' : ''}`}>
                        <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background dark:bg-muted border-2 border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className="px-4 py-3 hover:bg-secondary/90  cursor-pointer flex items-center justify-between group transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <span>{option.name}</span>
                                    {selectedValue === option.id && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                            ))
                        ) : !showCreateOption ? (
                            <div className="px-4 py-3 text-muted-foreground text-center">
                                No results found
                            </div>
                        ) : null}

                        {showCreateOption && (
                            <div
                                onClick={handleCreate}
                                className="px-4 py-3 hover:bg-secondary/90 cursor-pointer flex items-center gap-3 border-solid border-border transition-colors"
                            >
                                {
                                    isCreating ? <div className="w-4 h-4"><Spinner className="w-5 h-5 text-muted-foreground" /></div> : <Plus className="w-5 h-5 text-muted-foreground" />
                                }

                                <span className="text-muted-foreground hover:text-foreground">
                                    Create <strong className="text-secondary-foreground">"{search}"</strong>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export { SearchableDropdown, type Option };
