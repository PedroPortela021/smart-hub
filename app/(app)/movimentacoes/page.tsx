import { MovementForm } from "@/components/movimentacoes/movement-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime, firstParam } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import type { Prisma } from "@prisma/client"

export default async function MovimentacoesPage({
  searchParams,
}: {
  searchParams: Promise<{
    produto?: string | string[]
    de?: string | string[]
    ate?: string | string[]
  }>
}) {
  await requireUser()
  const params = await searchParams
  const productId = firstParam(params.produto) ?? ""
  const from = parseDay(firstParam(params.de), false)
  const to = parseDay(firstParam(params.ate), true)

  const where: Prisma.MovementWhereInput = {}
  if (productId) {
    where.productId = productId
  }
  if (from || to) {
    where.createdAt = {
      gte: from,
      lte: to,
    }
  }

  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true, quantity: true },
    }),
    prisma.movement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true } },
      },
    }),
  ])

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Movimentações</h1>
        <p className="text-sm text-muted-foreground">
          Entradas e saídas que atualizam o saldo.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nova movimentação</CardTitle>
          <CardDescription>
            A saída só é registrada quando o saldo cobre a quantidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MovementForm products={products} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action="/movimentacoes" className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2">
              <Label htmlFor="filter-product">Produto</Label>
              <select
                id="filter-product"
                name="produto"
                defaultValue={productId}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">Todos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-from">De</Label>
              <Input
                id="filter-from"
                name="de"
                type="date"
                defaultValue={firstParam(params.de) ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-to">Até</Label>
              <Input
                id="filter-to"
                name="ate"
                type="date"
                defaultValue={firstParam(params.ate) ?? ""}
              />
            </div>
            <Button type="submit" variant="outline">
              Filtrar
            </Button>
          </form>
          {movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma movimentação encontrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Usuário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{formatDateTime(movement.createdAt)}</TableCell>
                    <TableCell>
                      {movement.product.name} ({movement.product.sku})
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          movement.type === "ENTRY" ? "secondary" : "outline"
                        }
                      >
                        {movement.type === "ENTRY" ? "Entrada" : "Saída"}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{movement.user.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function parseDay(value: string | undefined, end: boolean) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined
  }
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00"}`)
  return Number.isNaN(date.getTime()) ? undefined : date
}
