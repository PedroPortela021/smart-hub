import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type MovementType } from "@prisma/client"
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

type SeedMovement = {
  type: MovementType
  quantity: number
  daysAgo: number
}

type SeedProduct = {
  name: string
  sku: string
  price: string
  minStock: number
  movements: SeedMovement[]
}

const products: SeedProduct[] = [
  {
    name: "Notebook Dell Inspiron 15",
    sku: "NB-DELL-I15",
    price: "3499.00",
    minStock: 3,
    movements: [
      { type: "ENTRY", quantity: 8, daysAgo: 28 },
      { type: "EXIT", quantity: 2, daysAgo: 12 },
      { type: "EXIT", quantity: 1, daysAgo: 2 },
    ],
  },
  {
    name: "Notebook Lenovo IdeaPad 3",
    sku: "NB-LEN-IP3",
    price: "2899.00",
    minStock: 3,
    movements: [
      { type: "ENTRY", quantity: 6, daysAgo: 26 },
      { type: "EXIT", quantity: 4, daysAgo: 5 },
    ],
  },
  {
    name: "Monitor LG 24 Full HD",
    sku: "MON-LG-24",
    price: "799.00",
    minStock: 5,
    movements: [
      { type: "ENTRY", quantity: 15, daysAgo: 30 },
      { type: "EXIT", quantity: 4, daysAgo: 9 },
    ],
  },
  {
    name: "Monitor Dell 27 QHD",
    sku: "MON-DELL-27",
    price: "1599.00",
    minStock: 2,
    movements: [
      { type: "ENTRY", quantity: 4, daysAgo: 21 },
      { type: "EXIT", quantity: 1, daysAgo: 4 },
    ],
  },
  {
    name: "Teclado mecânico Redragon Kumara",
    sku: "TEC-RD-K552",
    price: "249.90",
    minStock: 8,
    movements: [
      { type: "ENTRY", quantity: 20, daysAgo: 24 },
      { type: "EXIT", quantity: 6, daysAgo: 8 },
    ],
  },
  {
    name: "Mouse Logitech MX Master 3S",
    sku: "MOU-LOG-MX3S",
    price: "549.00",
    minStock: 4,
    movements: [
      { type: "ENTRY", quantity: 10, daysAgo: 22 },
      { type: "EXIT", quantity: 7, daysAgo: 3 },
    ],
  },
  {
    name: "Mousepad gamer XL",
    sku: "PAD-GAM-XL",
    price: "79.90",
    minStock: 10,
    movements: [
      { type: "ENTRY", quantity: 30, daysAgo: 18 },
      { type: "EXIT", quantity: 8, daysAgo: 6 },
    ],
  },
  {
    name: "Headset HyperX Cloud II",
    sku: "HST-HX-C2",
    price: "399.00",
    minStock: 4,
    movements: [
      { type: "ENTRY", quantity: 12, daysAgo: 19 },
      { type: "EXIT", quantity: 5, daysAgo: 7 },
    ],
  },
  {
    name: "Webcam Logitech C920",
    sku: "WEB-LOG-C920",
    price: "429.00",
    minStock: 3,
    movements: [
      { type: "ENTRY", quantity: 5, daysAgo: 16 },
      { type: "EXIT", quantity: 3, daysAgo: 1 },
    ],
  },
  {
    name: "SSD NVMe 1TB Kingston",
    sku: "SSD-KIN-1TB",
    price: "389.00",
    minStock: 6,
    movements: [
      { type: "ENTRY", quantity: 25, daysAgo: 27 },
      { type: "EXIT", quantity: 9, daysAgo: 11 },
    ],
  },
  {
    name: "SSD SATA 480GB Kingston",
    sku: "SSD-KIN-480",
    price: "219.00",
    minStock: 8,
    movements: [
      { type: "ENTRY", quantity: 10, daysAgo: 20 },
      { type: "EXIT", quantity: 8, daysAgo: 2 },
    ],
  },
  {
    name: "Memória DDR4 16GB",
    sku: "MEM-DDR4-16",
    price: "249.00",
    minStock: 10,
    movements: [
      { type: "ENTRY", quantity: 40, daysAgo: 29 },
      { type: "EXIT", quantity: 12, daysAgo: 10 },
    ],
  },
  {
    name: "Memória DDR5 16GB",
    sku: "MEM-DDR5-16",
    price: "429.00",
    minStock: 4,
    movements: [
      { type: "ENTRY", quantity: 8, daysAgo: 15 },
      { type: "EXIT", quantity: 2, daysAgo: 4 },
    ],
  },
  {
    name: "Roteador Wi-Fi 6 TP-Link AX1800",
    sku: "ROT-TPL-AX18",
    price: "349.00",
    minStock: 3,
    movements: [
      { type: "ENTRY", quantity: 9, daysAgo: 17 },
      { type: "EXIT", quantity: 3, daysAgo: 6 },
    ],
  },
  {
    name: "Switch 8 portas Gigabit",
    sku: "SW-TPL-8G",
    price: "189.00",
    minStock: 4,
    movements: [
      { type: "ENTRY", quantity: 12, daysAgo: 23 },
      { type: "EXIT", quantity: 2, daysAgo: 9 },
    ],
  },
  {
    name: "Cabo HDMI 2m",
    sku: "CAB-HDMI-2M",
    price: "29.90",
    minStock: 20,
    movements: [
      { type: "ENTRY", quantity: 50, daysAgo: 25 },
      { type: "EXIT", quantity: 35, daysAgo: 3 },
    ],
  },
  {
    name: "Cabo de rede Cat6 5m",
    sku: "CAB-CAT6-5M",
    price: "24.90",
    minStock: 15,
    movements: [
      { type: "ENTRY", quantity: 40, daysAgo: 25 },
      { type: "EXIT", quantity: 10, daysAgo: 8 },
    ],
  },
  {
    name: "Pen drive 64GB SanDisk",
    sku: "PD-SD-64",
    price: "49.90",
    minStock: 12,
    movements: [
      { type: "ENTRY", quantity: 30, daysAgo: 14 },
      { type: "EXIT", quantity: 11, daysAgo: 2 },
    ],
  },
  {
    name: "HD externo 1TB Seagate",
    sku: "HD-SEA-1TB",
    price: "329.00",
    minStock: 4,
    movements: [
      { type: "ENTRY", quantity: 7, daysAgo: 13 },
      { type: "EXIT", quantity: 2, daysAgo: 5 },
    ],
  },
  {
    name: "Nobreak 1200VA SMS",
    sku: "UPS-SMS-1200",
    price: "699.00",
    minStock: 2,
    movements: [
      { type: "ENTRY", quantity: 4, daysAgo: 12 },
      { type: "EXIT", quantity: 1, daysAgo: 4 },
    ],
  },
  {
    name: "Impressora laser HP M404",
    sku: "IMP-HP-M404",
    price: "1499.00",
    minStock: 2,
    movements: [
      { type: "ENTRY", quantity: 3, daysAgo: 18 },
      { type: "EXIT", quantity: 2, daysAgo: 1 },
    ],
  },
  {
    name: "Toner HP 58A",
    sku: "TON-HP-58A",
    price: "389.00",
    minStock: 5,
    movements: [
      { type: "ENTRY", quantity: 15, daysAgo: 18 },
      { type: "EXIT", quantity: 6, daysAgo: 6 },
    ],
  },
  {
    name: "Dock USB-C 7 em 1",
    sku: "DCK-USBC-7",
    price: "199.00",
    minStock: 4,
    movements: [
      { type: "ENTRY", quantity: 10, daysAgo: 11 },
      { type: "EXIT", quantity: 4, daysAgo: 3 },
    ],
  },
  {
    name: "Fonte ATX 650W 80 Plus",
    sku: "FON-650-80P",
    price: "459.00",
    minStock: 3,
    movements: [
      { type: "ENTRY", quantity: 6, daysAgo: 16 },
      { type: "EXIT", quantity: 1, daysAgo: 7 },
    ],
  },
  {
    name: "Placa de vídeo RTX 4060",
    sku: "GPU-RTX-4060",
    price: "2299.00",
    minStock: 2,
    movements: [
      { type: "ENTRY", quantity: 4, daysAgo: 20 },
      { type: "EXIT", quantity: 3, daysAgo: 1 },
    ],
  },
  {
    name: "Processador Ryzen 5 5600",
    sku: "CPU-R5-5600",
    price: "899.00",
    minStock: 2,
    movements: [
      { type: "ENTRY", quantity: 5, daysAgo: 19 },
      { type: "EXIT", quantity: 1, daysAgo: 8 },
    ],
  },
  {
    name: "Gabinete Mid Tower ATX",
    sku: "GAB-MT-ATX",
    price: "329.00",
    minStock: 3,
    movements: [
      { type: "ENTRY", quantity: 6, daysAgo: 14 },
      { type: "EXIT", quantity: 2, daysAgo: 5 },
    ],
  },
  {
    name: "Kit teclado e mouse sem fio Logitech",
    sku: "KIT-LOG-MK270",
    price: "159.00",
    minStock: 6,
    movements: [
      { type: "ENTRY", quantity: 18, daysAgo: 10 },
      { type: "EXIT", quantity: 5, daysAgo: 2 },
    ],
  },
]

function balance(movements: SeedMovement[]) {
  return movements.reduce((total, movement) => {
    return movement.type === "ENTRY"
      ? total + movement.quantity
      : total - movement.quantity
  }, 0)
}

function occurredAt(daysAgo: number, sequence: number) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(9 + (sequence % 8), (sequence * 7) % 60, 0, 0)
  return date
}

async function main() {
  for (const product of products) {
    const quantity = balance(product.movements)
    if (quantity < 0) {
      throw new Error(`Saldo negativo em ${product.sku}.`)
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const summary = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: { name: "Administrador", passwordHash },
      create: { name: "Administrador", email, passwordHash },
    })

    await tx.movement.deleteMany()
    await tx.product.deleteMany()

    let movementCount = 0
    let lowStock = 0

    for (const [index, product] of products.entries()) {
      const quantity = balance(product.movements)
      if (quantity <= product.minStock) {
        lowStock += 1
      }

      const created = await tx.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          price: product.price,
          minStock: product.minStock,
          quantity,
          movements: {
            create: product.movements.map((movement, movementIndex) => ({
              type: movement.type,
              quantity: movement.quantity,
              userId: user.id,
              createdAt: occurredAt(
                movement.daysAgo,
                index * 10 + movementIndex,
              ),
            })),
          },
        },
      })

      movementCount += created ? product.movements.length : 0
    }

    return { products: products.length, movementCount, lowStock }
  })

  console.log(
    `Seed concluída: ${summary.products} produtos, ${summary.movementCount} movimentações, ${summary.lowStock} abaixo do mínimo.`,
  )
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
