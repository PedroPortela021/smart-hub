"use client"

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/actions/products"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useId, useState, useTransition, type FormEvent } from "react"
import { toast } from "sonner"

export type ProductRow = {
  id: string
  name: string
  sku: string
  price: string
  quantity: number
  minStock: number
  movementCount: number
}

export function CreateProductDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Novo produto</Button>
      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        title="Novo produto"
        description="A quantidade inicial, quando maior que zero, gera uma entrada de estoque."
        submitLabel="Cadastrar"
        action={createProduct}
        successMessage="Produto cadastrado."
      />
    </>
  )
}

export function ProductRowActions({ product }: { product: ProductRow }) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function confirmDelete() {
    const formData = new FormData()
    formData.set("id", product.id)
    setDeleteError(null)
    startTransition(async () => {
      const result = await deleteProduct(formData)
      if (!result.ok) {
        setDeleteError(result.error)
        toast.error(result.error)
        return
      }
      toast.success("Produto excluído.")
      setConfirming(false)
      router.refresh()
    })
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        Editar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setConfirming(true)}
      >
        Excluir
      </Button>
      <ProductDialog
        open={editing}
        onOpenChange={setEditing}
        title="Editar produto"
        description="A quantidade em estoque só muda por movimentação."
        submitLabel="Salvar"
        action={updateProduct}
        successMessage="Produto atualizado."
        product={product}
      />
      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir produto</DialogTitle>
            <DialogDescription>
              Confirma a exclusão de {product.name}? Produtos com movimentação
              permanecem no cadastro.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={confirmDelete}
            >
              {pending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  action,
  successMessage,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  submitLabel: string
  action: (formData: FormData) => Promise<{ ok: true } | { ok: false; error: string }>
  successMessage: string
  product?: ProductRow
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await action(formData)
      if (!result.ok) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      toast.success(successMessage)
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-3">
          {product ? <input type="hidden" name="id" value={product.id} /> : null}
          <Field label="Nome" name="name" defaultValue={product?.name} required />
          <Field label="SKU" name="sku" defaultValue={product?.sku} required />
          <Field
            label="Preço"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.price ?? "0.00"}
            required
          />
          <Field
            label="Estoque mínimo"
            name="minStock"
            type="number"
            min="0"
            step="1"
            defaultValue={product ? String(product.minStock) : "0"}
            required
          />
          {product ? null : (
            <Field
              label="Quantidade inicial"
              name="quantity"
              type="number"
              min="0"
              step="1"
              defaultValue="0"
              required
            />
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  min,
  step,
}: {
  label: string
  name: string
  defaultValue?: string
  type?: string
  required?: boolean
  min?: string
  step?: string
}) {
  const id = useId()
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        step={step}
      />
    </div>
  )
}
