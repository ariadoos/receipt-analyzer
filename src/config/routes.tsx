import Category from '@/pages/Category'
import Dashboard from '@/pages/Dashboard'
import Expense from '@/pages/Expense'
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
        path: '/expense',
        label: 'Expense',
        useInNavigation: true,
        showNav: true,
        component: Expense,
    },
    {
        path: '/category',
        label: 'Category',
        useInNavigation: true,
        showNav: true,
        component: Category,
    },
    {
        path: '*',
        label: 'Not Found',
        useInNavigation: false,
        showNav: false,
        component: NotFoundPage
    }
]
