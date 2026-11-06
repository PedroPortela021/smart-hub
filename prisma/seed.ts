import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

const email = "admin@estoque.local"
const password = "admin123"

async function main() {
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Administrador",
      passwordHash,
    },
    create: {
      name: "Administrador",
      email,
      passwordHash,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
