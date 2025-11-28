import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

const prisma = new PrismaClient();

// This endpoint should only be accessible once to seed the database
// You can add authentication or delete it after use
export async function POST(request: Request) {
    try {
        const { secretKey } = await request.json();

        // Simple protection - change this secret or use environment variable
        if (secretKey !== process.env.SEED_SECRET_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if already seeded
        const agencyCount = await prisma.agency.count();
        if (agencyCount > 0) {
            return NextResponse.json({
                message: 'Database already seeded',
                agencyCount
            });
        }

        console.log('Starting database seed...');

        // Fetch CSV files from your repository or uploaded location
        // For Vercel, you'll need to include these files in your deployment
        // or fetch them from a URL

        // Determine the base URL and ensure it has a protocol
        let baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        if (!baseUrl.startsWith('http')) {
            baseUrl = `https://${baseUrl}`;
        }
        // Remove trailing slash if present to avoid double slashes
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        console.log(`Fetching CSV data from: ${baseUrl}`);

        const agenciesResponse = await fetch(`${baseUrl}/data/agencies_agency_rows.csv`);
        const contactsResponse = await fetch(`${baseUrl}/data/contacts_contact_rows.csv`);

        const agenciesCSV = await agenciesResponse.text();
        const contactsCSV = await contactsResponse.text();

        const agenciesData = Papa.parse(agenciesCSV, { header: true, skipEmptyLines: true }).data;
        const contactsData = Papa.parse(contactsCSV, { header: true, skipEmptyLines: true }).data;

        console.log(`Seeding ${agenciesData.length} agencies...`);

        // Batch insert agencies
        const cleanAgencies = agenciesData.map((row: any) => ({
            id: row.id,
            name: row.name,
            state: row.state,
            state_code: row.state_code,
            type: row.type,
            population: row.population,
            website: row.website,
            total_schools: row.total_schools,
            total_students: row.total_students,
            mailing_address: row.mailing_address,
            grade_span: row.grade_span,
            locale: row.locale,
            csa_cbsa: row.csa_cbsa,
            domain_name: row.domain_name,
            physical_address: row.physical_address,
            phone: row.phone,
            status: row.status,
            student_teacher_ratio: row.student_teacher_ratio,
            supervisory_union: row.supervisory_union,
            county: row.county,
            created_at: row.created_at ? new Date(row.created_at) : undefined,
            updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
        }));

        // Use createMany for better performance with PostgreSQL
        await prisma.agency.createMany({
            data: cleanAgencies,
        });

        console.log(`Seeding ${contactsData.length} contacts...`);

        const cleanContacts = contactsData.map((row: any) => ({
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            phone: row.phone,
            title: row.title,
            email_type: row.email_type,
            contact_form_url: row.contact_form_url,
            created_at: row.created_at ? new Date(row.created_at) : undefined,
            updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
            agency_id: row.agency_id,
            firm_id: row.firm_id,
            department: row.department,
        }));

        await prisma.contact.createMany({
            data: cleanContacts,
        });

        const finalAgencyCount = await prisma.agency.count();
        const finalContactCount = await prisma.contact.count();

        console.log('Seeding completed.');

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            agencies: finalAgencyCount,
            contacts: finalContactCount,
        });

    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({
            error: 'Seeding failed',
            details: error.message,
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST method with secretKey to seed the database',
        note: 'This endpoint should be deleted after seeding'
    });
}
