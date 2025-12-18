import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

const Nav = () => {
    const navItems = ROUTES.filter(route => route.useInNavigation);
    const location = useLocation()

    return (
        <nav className="sticky bg-card border-t border-b border-border z-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 h-14 items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors h-full',
                            location.pathname === item.path
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {item.icon && <span className="text-lg">{item.icon}</span>}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default Nav
