import { currentUser } from '@clerk/nextjs/server';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import Image from 'next/image';

export async function Header() {
    const user = await currentUser();

    return (
        <header className="flex h-16 items-center justify-between bg-card px-6 border-b border-border">
            <div className="text-sm font-medium text-muted-foreground">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                    {user?.imageUrl && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
                            <Image
                                src={user.imageUrl}
                                alt={user.firstName || 'User'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium text-foreground">
                            {user?.firstName || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {user?.emailAddresses?.[0]?.emailAddress}
                        </span>
                    </div>
                </Link>
            </div>
        </header>
    );
}
