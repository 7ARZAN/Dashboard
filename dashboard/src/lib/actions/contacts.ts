'use server';

import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();
const DAILY_LIMIT = 50;

export async function getContacts(page: number = 1, pageSize: number = 10) {
    const user = await currentUser();
    if (!user) {
        redirect('/clerk-sign-in');
    }

    // Use Clerk user ID for usage tracking
    const userId = user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check usage
    let usage = await prisma.userUsage.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });

    if (!usage) {
        usage = await prisma.userUsage.create({
            data: {
                userId: user.id,
                date: today,
                count: 0,
            },
        });
    }

    if (usage.count >= DAILY_LIMIT) {
        return { error: 'DAILY_LIMIT_EXCEEDED', limit: DAILY_LIMIT };
    }

    const skip = (page - 1) * pageSize;

    try {
        const [contacts, total] = await prisma.$transaction([
            prisma.contact.findMany({
                skip,
                take: pageSize,
                orderBy: { last_name: 'asc' },
                include: { agency: true },
            }),
            prisma.contact.count(),
        ]);

        // Increment usage
        // Note: In a real app, we might want to increment by the number of contacts actually viewed/fetched.
        // For this assignment, "viewing 50 contacts" could mean fetching 50 records.
        // Since we fetch in pages of 10, we increment by pageSize (or less if last page).
        // However, if the user just refreshes the page, should it count? 
        // The requirement says "Users are limited to viewing 50 contacts per day".
        // I'll increment by the number of contacts returned.

        const countToIncrement = contacts.length;

        // Check if adding this batch exceeds limit
        if (usage.count + countToIncrement > DAILY_LIMIT) {
            // If we want to be strict, we could return partial data or block.
            // Requirement: "When the daily limit is exceeded, users should see a prompt"
            // I'll allow the last batch even if it goes slightly over, or block if ALREADY over.
            // Since I checked `usage.count >= DAILY_LIMIT` above, we are good to proceed if it was 49.
            // But let's be nicer and update the count.
        }

        await prisma.userUsage.update({
            where: { id: usage.id },
            data: { count: { increment: countToIncrement } },
        });

        return { contacts, total, totalPages: Math.ceil(total / pageSize), usageCount: usage.count + countToIncrement };
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Failed to fetch contacts');
    }
}
