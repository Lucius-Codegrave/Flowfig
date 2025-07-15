"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * Prisma database client instance
 * Handles all database operations with PostgreSQL
 */
const prisma = new client_1.PrismaClient();
exports.default = prisma;
