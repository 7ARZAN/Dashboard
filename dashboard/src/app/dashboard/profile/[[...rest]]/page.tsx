'use client';

import { UserProfile } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        features: ['50 contacts/day', 'Basic support', 'Email notifications'],
        current: true,
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        features: ['Unlimited contacts', 'Priority support', 'Advanced analytics', 'API access'],
        current: false,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
        current: false,
    },
];

export default function ProfilePage() {
    const [selectedPlan, setSelectedPlan] = useState('Free');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <PageWrapper>
            <div className="space-y-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>

                {/* Clerk User Profile - Responsive */}
                <div className="w-full">
                    <UserProfile
                        appearance={{
                            variables: {
                                colorPrimary: isDark ? '#2196f3' : '#0066cc',
                                colorBackground: isDark ? '#0a1929' : '#ffffff',
                                colorText: isDark ? '#e3f2fd' : '#0f172a',
                                colorInputBackground: isDark ? '#1a2942' : '#f8fafc',
                                colorInputText: isDark ? '#e3f2fd' : '#0f172a',
                            },
                            elements: {
                                rootBox: 'w-full',
                                card: 'data-card w-full',
                                navbar: 'hidden md:block',
                                pageScrollBox: 'w-full',
                            },
                        }}
                    />
                </div>

                {/* Plan Selection - Responsive Grid */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Choose Your Plan</h3>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`data-card cursor-pointer transition-all hover:scale-105 ${selectedPlan === plan.name ? 'ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => setSelectedPlan(plan.name)}
                            >
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center justify-between text-lg">
                                        {plan.name}
                                        {plan.current && (
                                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                                Current
                                            </span>
                                        )}
                                    </CardTitle>
                                    <div className="mt-2">
                                        <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className={`w-full ${selectedPlan === plan.name
                                            ? 'bg-primary hover:bg-primary/90'
                                            : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPlan(plan.name);
                                            if (!plan.current) {
                                                alert(`Upgrading to ${plan.name} plan! (This is a demo)`);
                                            }
                                        }}
                                    >
                                        {plan.current ? 'Current Plan' : 'Select Plan'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
