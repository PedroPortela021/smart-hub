"use client"

import { createMovement } from "@/actions/movements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useTransition, type FormEvent } from "react"
import { toast } from "sonner"

export type MovementProductOption = {
  id: string
  name: string
  sku: string
  quantity: number
}

const movementTypes = [
  { value: "ENTRY", label: "Entrada" },
  { value: "EXIT", label: "Saída" },
]

export function MovementForm({ products }: { products: MovementProductOption[] }) {
  const [pending, startTransition] = useTransition()
  const [formKey, setFormKey] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await createMovement(formData)
      if (!result.ok) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      toast.success("Movimentação registrada.")
      setError(null)
      setFormKey((key) => key + 1)
      router.refresh()
    })
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Cadastre um produto antes de lançar movimentações.
      </p>
    )
  }

  const productItems = products.map((product) => ({
    value: product.id,
    label: `${product.name} (${product.sku}) — saldo ${product.quantity}`,
  }))

  return (
    <form key={formKey} onSubmit={onSubmit} className="grid gap-4 md:grid-cols-4">
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="movement-product">Produto</Label>
        <Select name="productId" required items={productItems}>
          <SelectTrigger id="movement-product" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {productItems.map((product) => (
              <SelectItem key={product.value} value={product.value}>
                {product.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="movement-type">Tipo</Label>
        <Select name="type" defaultValue="ENTRY" items={movementTypes}>
          <SelectTrigger id="movement-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {movementTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="movement-quantity">Quantidade</Label>
        <Input
          id="movement-quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          required
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive md:col-span-4">{error}</p>
      ) : null}
      <div className="md:col-span-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </form>
  )
}
