import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Check if database is already seeded
    const agencyCount = await prisma.agency.count();
    const contactCount = await prisma.contact.count();

    // Correct paths for Vercel environment (files are in public/data)
    const agenciesPath = path.join(process.cwd(), 'public/data/agencies_agency_rows.csv');
    const contactsPath = path.join(process.cwd(), 'public/data/contacts_contact_rows.csv');

    const agenciesFile = fs.readFileSync(agenciesPath, 'utf8');
    const contactsFile = fs.readFileSync(contactsPath, 'utf8');

    const agenciesData = Papa.parse(agenciesFile, { header: true, skipEmptyLines: true }).data;
    const contactsData = Papa.parse(contactsFile, { header: true, skipEmptyLines: true }).data;

    if (agencyCount === 0) {
        console.log(`Reading data from: ${agenciesPath}`);
        console.log(`Seeding ${agenciesData.length} agencies...`);

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

        // Use createMany for better performance
        await prisma.agency.createMany({
            data: cleanAgencies,
        });
    } else {
        console.log('Agencies already seeded. Skipping...');
    }

    if (contactCount === 0) {
        // Fetch all valid agency IDs to ensure data integrity
        const validAgencyIds = new Set((await prisma.agency.findMany({ select: { id: true } })).map(a => a.id));

        console.log(`Seeding ${contactsData.length} contacts...`);

        const cleanContacts = contactsData.map((row: any) => {
            // specific check for foreign key validity
            let agencyId = row.agency_id;
            if (agencyId && !validAgencyIds.has(agencyId)) {
                // console.warn(`Skipping invalid agency_id ${agencyId} for contact ${row.id}`);
                agencyId = null; // Set to null if agency doesn't exist to avoid FK violation
            }

            return {
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
                agency_id: agencyId,
                firm_id: row.firm_id,
                department: row.department,
            };
        });

        // Use createMany for contacts
        await prisma.contact.createMany({
            data: cleanContacts,
        });
    } else {
        console.log('Contacts already seeded. Skipping...');
    }

    console.log('Seeding default user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    // Upsert user to ensure admin exists
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
        },
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
