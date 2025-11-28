'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Contact {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    title: string | null;
    agency?: {
        name: string | null;
    };
}

interface ContactsTableProps {
    contacts: Contact[];
    totalPages: number;
    currentPage: number;
    limitReached: boolean;
}

export function ContactsTable({
    contacts,
    totalPages,
    currentPage,
    limitReached,
}: ContactsTableProps) {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        if (limitReached) {
            setShowUpgradeModal(true);
        }
    }, [limitReached]);

    return (
        <div className="space-y-6">
            <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />

            <div className="data-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Agency</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell className="font-medium">
                                    {contact.first_name} {contact.last_name}
                                </TableCell>
                                <TableCell>{contact.title}</TableCell>
                                <TableCell>{contact.agency?.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                            </TableRow>
                        ))}
                        {contacts.length === 0 && !limitReached && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No contacts found.
                                </TableCell>
                            </TableRow>
                        )}
                        {limitReached && contacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-primary font-medium">
                                    Daily limit reached. Please upgrade to view more contacts.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1 || limitReached}
                    asChild={!limitReached}
                >
                    {!limitReached ? (
                        <Link href={`/dashboard/contacts?page=${currentPage - 1}`}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    ) : (
                        <span className="flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </span>
                    )}
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {limitReached ? '?' : totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={(currentPage >= totalPages && !limitReached) || limitReached}
                    asChild={!limitReached}
                >
                    {!limitReached ? (
                        <Link href={`/dashboard/contacts?page=${currentPage + 1}`}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span className="flex items-center gap-1">
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
