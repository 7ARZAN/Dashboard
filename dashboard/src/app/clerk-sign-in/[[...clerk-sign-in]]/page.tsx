'use client';

import { SignIn } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export default function ClerkSignInPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="flex min-h-screen items-center justify-center bg-background animate-fade-in">
            <SignIn
                appearance={{
                    variables: {
                        colorPrimary: '#F64A35',
                        colorBackground: isDark ? '#1B1B27' : '#ffffff',
                        colorText: isDark ? '#ffffff' : '#1B1B27',
                        colorInputBackground: isDark ? '#2d2d3d' : '#f8f9fa',
                        colorInputText: isDark ? '#ffffff' : '#1B1B27',
                    },
                }}
            />
        </div>
    );
}
