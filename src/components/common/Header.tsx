import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
    return (
        <header className="bg-card border-b border-border sticky top-0 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-primary">RA</div>
                        <span className="text-sm font-medium hidden sm:inline">Receipt Analyzer</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}
