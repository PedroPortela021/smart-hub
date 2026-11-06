"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import type { ActionResult } from "@/lib/action-result"
import { firstIssue, movementSchema } from "@/lib/validators"

class MovementError extends Error {}

export async function createMovement(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = movementSchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
  })

  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error) }
  }

  const { productId, type, quantity } = parsed.data

  try {
    await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<Array<{ quantity: number }>>`
        SELECT quantity FROM "Product" WHERE id = ${productId} FOR UPDATE
      `
      const current = rows[0]
      if (!current) {
        throw new MovementError("Produto inexistente.")
      }

      const available = Number(current.quantity)
      if (type === "EXIT" && available < quantity) {
        throw new MovementError(
          `Saldo insuficiente. Disponível: ${available}.`,
        )
      }

      await tx.movement.create({
        data: {
          type,
          quantity,
          productId,
          userId: user.id,
        },
      })

      await tx.product.update({
        where: { id: productId },
        data: {
          quantity:
            type === "ENTRY" ? { increment: quantity } : { decrement: quantity },
        },
      })
    })
  } catch (error) {
    if (error instanceof MovementError) {
      return { ok: false, error: error.message }
    }
    throw error
  }

  revalidatePath("/movimentacoes")
  revalidatePath("/produtos")
  revalidatePath("/dashboard")
  return { ok: true }
}
