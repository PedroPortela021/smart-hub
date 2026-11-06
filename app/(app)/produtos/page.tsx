import {
  CreateProductDialog,
  ProductRowActions,
} from "@/components/produtos/product-dialogs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, firstParam } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  await requireUser()
  const params = await searchParams
  const query = firstParam(params.q)?.trim() ?? ""

  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { movements: true } } },
  })

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro e consulta do estoque.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form action="/produtos" className="flex gap-2">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Buscar por nome ou SKU"
              className="w-64"
            />
            <Button type="submit" variant="outline">
              Buscar
            </Button>
          </form>
          <CreateProductDialog />
        </div>
      </div>
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Mínimo</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  {query
                    ? "Nenhum produto encontrado para essa busca."
                    : "Nenhum produto cadastrado."}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const low = product.quantity <= product.minStock
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>
                      <Badge variant={low ? "destructive" : "secondary"}>
                        {low ? "Baixo" : "Ok"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ProductRowActions
                        product={{
                          id: product.id,
                          name: product.name,
                          sku: product.sku,
                          price: product.price.toFixed(2),
                          quantity: product.quantity,
                          minStock: product.minStock,
                          movementCount: product._count.movements,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
