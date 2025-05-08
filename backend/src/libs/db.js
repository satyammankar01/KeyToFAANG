import {PrismaClient} from "../generated/prisma/index.js"

const globalforPrisma = globalThis

/**@type {import('@prisma/client').PrismaClient} */
export const db = globalforPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production" ) globalforPrisma.prisma = db