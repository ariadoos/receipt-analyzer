import Dashboard from '@/pages/Dashboard'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { type ReactNode } from 'react'

export interface Route {
    path: string
    label: string
    useInNavigation: boolean
    showNav: boolean
    icon?: string
    component: () => ReactNode
}

export const ROUTES: Route[] = [
    {
        path: '/',
        label: 'Dashboard',
        useInNavigation: true,
        showNav: true,
        component: Dashboard,
    },
    {
        path: '*',
        label: 'Not Found',
        useInNavigation: false,
        showNav: false,
        component: NotFoundPage
    }
]
