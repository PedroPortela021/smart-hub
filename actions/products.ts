"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import type { ActionResult } from "@/lib/action-result"
import {
  createProductSchema,
  firstIssue,
  updateProductSchema,
} from "@/lib/validators"

function revalidateStock() {
  revalidatePath("/produtos")
  revalidatePath("/movimentacoes")
  revalidatePath("/dashboard")
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createProductSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    minStock: formData.get("minStock"),
    quantity: formData.get("quantity"),
  })

  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error) }
  }

  const { name, sku, price, minStock, quantity } = parsed.data

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          sku,
          price,
          minStock,
          quantity,
        },
      })

      if (quantity > 0) {
        await tx.movement.create({
          data: {
            type: "ENTRY",
            quantity,
            productId: product.id,
            userId: user.id,
          },
        })
      }
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "SKU já cadastrado." }
    }
    throw error
  }

  revalidateStock()
  return { ok: true }
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  await requireUser()
  const parsed = updateProductSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    minStock: formData.get("minStock"),
  })

  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error) }
  }

  const { id, name, sku, price, minStock } = parsed.data

  try {
    await prisma.product.update({
      where: { id },
      data: { name, sku, price, minStock },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "SKU já cadastrado." }
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, error: "Produto inexistente." }
    }
    throw error
  }

  revalidateStock()
  return { ok: true }
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  await requireUser()
  const id = formData.get("id")
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false, error: "Produto inexistente." }
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { movements: true } } },
  })

  if (!product) {
    return { ok: false, error: "Produto inexistente." }
  }

  if (product._count.movements > 0) {
    return {
      ok: false,
      error: "Este produto possui movimentações e não pode ser excluído.",
    }
  }

  await prisma.product.delete({ where: { id } })
  revalidateStock()
  return { ok: true }
}
