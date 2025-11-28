'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, LogOut, Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/agencies', label: 'Agencies', icon: Building2 },
    { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Toggle button for mobile/collapsed state */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors md:hidden"
            >
                {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>

            {/* Sidebar */}
            <div
                className={cn(
                    'flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
                    isCollapsed ? 'w-0 md:w-16' : 'w-64'
                )}
            >
                <div className={cn(
                    'flex h-16 items-center border-b border-sidebar-border transition-all cursor-pointer hover:bg-sidebar-accent',
                    isCollapsed ? 'px-2 justify-center' : 'px-6'
                )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {!isCollapsed && <h1 className="text-xl font-bold text-primary">DASHBOARD</h1>}
                    {isCollapsed && <LayoutDashboard className="h-6 w-6 text-primary" />}
                </div>

                <nav className="flex-1 space-y-1 px-2 py-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                    isCollapsed && 'justify-center'
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-2">
                    <SignOutButton>
                        <button
                            className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors',
                                isCollapsed && 'justify-center'
                            )}
                            title={isCollapsed ? 'Sign Out' : undefined}
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && 'Sign Out'}
                        </button>
                    </SignOutButton>
                </div>

                {/* Collapse toggle for desktop */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex items-center justify-center p-2 border-t border-sidebar-border hover:bg-sidebar-accent transition-colors"
                >
                    {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </button>
            </div>
        </>
    );
}
