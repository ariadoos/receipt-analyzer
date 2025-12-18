import { ModeToggle } from '@/components/mode-toggle'
import Nav from './Nav'
import { ROUTES } from '@/config/routes';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const currentRoute = ROUTES.find(route => route.path === location.pathname);
    const shouldShowNav = currentRoute !== undefined && currentRoute?.showNav !== false;

    return (
        <header className="bg-card sticky top-0 z-50">
            <div className="w-full mx-auto lg:px-8">
                <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-primary">RA</div>
                        <span className="text-sm font-medium hidden sm:inline">Receipt Analyzer</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                    </div>
                </div>

                {/* Navigation */}
                {shouldShowNav && <Nav />}
            </div>
        </header>
    )
}

export default Header
