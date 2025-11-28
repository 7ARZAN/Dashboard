import { getContacts } from '@/lib/actions/contacts';
import { ContactsTable } from '@/components/ContactsTable';
import { PageWrapper } from '@/components/PageWrapper';
import Link from 'next/link';

export default async function ContactsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const result = await getContacts(page);

    const limitReached = 'error' in result && result.error === 'DAILY_LIMIT_EXCEEDED';
    const contacts = limitReached ? [] : result.contacts;
    const totalPages = limitReached ? 0 : (result.totalPages || 0);

    if (page < 1 || (!limitReached && totalPages > 0 && page > totalPages)) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
                    </div>
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                        Invalid page number. Please navigate back to the <Link href="/dashboard/contacts" className="underline font-semibold">first page</Link>.
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
                </div>

                <ContactsTable
                    contacts={contacts as any}
                    totalPages={totalPages as number}
                    currentPage={page}
                    limitReached={limitReached}
                />
            </div>
        </PageWrapper>
    );
}
