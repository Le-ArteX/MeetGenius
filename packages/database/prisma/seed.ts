import "dotenv/config";
import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
    const hashedPassword = await bcrypt.hash('password', 10);
    const user = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: hashedPassword,
            plan: 'PRO',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });