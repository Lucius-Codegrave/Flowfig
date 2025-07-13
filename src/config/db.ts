import { PrismaClient } from '@prisma/client';

/**
 * Prisma database client instance
 * Handles all database operations with PostgreSQL
 */
const prisma = new PrismaClient();

export default prisma;
