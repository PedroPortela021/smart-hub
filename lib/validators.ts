import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
})

function decimalField(message: string) {
  return z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => {
      const parsed = Number(value.replace(",", "."))
      return Number.isFinite(parsed) && parsed >= 0
    }, message)
    .transform((value) => Number(value.replace(",", ".")))
}

function integerField(message: string, min: number) {
  return z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => {
      if (!/^\d+$/.test(value)) {
        return false
      }
      return Number(value) >= min
    }, message)
    .transform((value) => Number(value))
}

const productFields = {
  name: z.string().trim().min(1, "Informe o nome.").max(120, "Nome muito longo."),
  sku: z.string().trim().min(1, "Informe o SKU.").max(40, "SKU muito longo."),
  price: decimalField("Informe um preço válido."),
  minStock: integerField("Informe um estoque mínimo válido.", 0),
}

export const createProductSchema = z.object({
  ...productFields,
  quantity: integerField("Informe uma quantidade inicial válida.", 0),
})

export const updateProductSchema = z.object({
  id: z.string().min(1),
  ...productFields,
})

export const movementSchema = z.object({
  productId: z.string().min(1, "Selecione um produto."),
  type: z.enum(["ENTRY", "EXIT"], { error: "Selecione o tipo." }),
  quantity: integerField("Informe uma quantidade maior que zero.", 1),
})

export function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Dados inválidos."
}
