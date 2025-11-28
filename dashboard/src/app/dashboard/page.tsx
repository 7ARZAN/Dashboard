import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';
import { getAgencies } from '@/lib/actions/agencies';
import { getContacts } from '@/lib/actions/contacts';
import { PageWrapper } from '@/components/PageWrapper';

export default async function DashboardPage() {
    // Fetch some initial stats
    // Note: getContacts increments usage, so maybe we shouldn't call it here just for stats if we want to be strict.
    // But for a summary, we might want to just count.
    // Let's just show static or fetch count only if we had a count-only action.
    // For now, I'll just show a welcome message and maybe fetch agencies count since that's free.

    const { total: totalAgencies } = await getAgencies(1, 1);

    return (
        <PageWrapper>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAgencies}</div>
                            <p className="text-xs text-muted-foreground">
                                Agencies in the database
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1000+</div>
                            <p className="text-xs text-muted-foreground">
                                Contacts available
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="data-card p-8">
                    <h3 className="text-lg font-medium">Welcome to the Dashboard</h3>
                    <p className="mt-2 text-muted-foreground">
                        Select "Agencies" or "Contacts" from the sidebar to view data.
                        Remember, you have a daily limit of 50 contact views.
                    </p>
                </div>
            </div>
        </PageWrapper>
    );
}
