'use server';

import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function getAgencies(page: number = 1, pageSize: number = 10) {
    // Check Clerk authentication
    const user = await currentUser();
    if (!user) {
        redirect('/clerk-sign-in');
    }

    const skip = (page - 1) * pageSize;

    try {
        const [agencies, total] = await prisma.$transaction([
            prisma.agency.findMany({
                skip,
                take: pageSize,
                orderBy: { name: 'asc' },
            }),
            prisma.agency.count(),
        ]);

        return { agencies, total, totalPages: Math.ceil(total / pageSize) };
    } catch (error) {
        console.error('Error fetching agencies:', error);
        throw new Error('Failed to fetch agencies');
    }
}
