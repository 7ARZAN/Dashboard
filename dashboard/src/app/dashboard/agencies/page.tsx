import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getAgencies } from '@/lib/actions/agencies';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

export default async function AgenciesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const { agencies, totalPages } = await getAgencies(page);

    if (page < 1 || (totalPages > 0 && page > totalPages)) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Agencies</h2>
                    </div>
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                        Invalid page number. Please navigate back to the <Link href="/dashboard/agencies" className="underline font-semibold">first page</Link>.
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Agencies</h2>
                </div>

                <div className="data-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Phone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agencies.map((agency: any) => (
                                <TableRow key={agency.id}>
                                    <TableCell className="font-medium">{agency.name}</TableCell>
                                    <TableCell>{agency.state}</TableCell>
                                    <TableCell>{agency.city || agency.mailing_address}</TableCell>
                                    <TableCell>{agency.phone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        asChild
                    >
                        <Link href={`/dashboard/agencies?page=${page - 1}`}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        asChild
                    >
                        <Link href={`/dashboard/agencies?page=${page + 1}`}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </PageWrapper>
    );
}
