import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada.")
  }

  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

let prismaClient = globalForPrisma.prisma

function getPrismaClient() {
  if (prismaClient) {
    return prismaClient
  }

  prismaClient = createPrismaClient()
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient
  }
  return prismaClient
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient()
    const value = Reflect.get(client, property, receiver)
    if (typeof value === "function") {
      return value.bind(client)
    }
    return value
  },
})
