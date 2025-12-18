import { type ReactNode } from 'react'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import { ROUTES } from '@/config/routes'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Main Content */}
                <main className="flex-1 bg-background">
                    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Layout
