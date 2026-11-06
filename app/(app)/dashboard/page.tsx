import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export default async function DashboardPage() {
  await requireUser()

  const [products, recent] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.movement.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true } },
      },
    }),
  ])

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.minStock,
  )
  const stockValue = products.reduce(
    (total, product) => total + product.quantity * Number(product.price),
    0,
  )

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do estoque.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Produtos" value={String(products.length)} />
        <SummaryCard
          title="Estoque baixo"
          value={String(lowStockProducts.length)}
        />
        <SummaryCard
          title="Valor em estoque"
          value={formatCurrency(stockValue)}
        />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Itens no mínimo ou abaixo</CardTitle>
          <CardDescription>
            Produtos cuja quantidade não supera o estoque mínimo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum produto abaixo do mínimo.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Mínimo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.minStock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Últimas movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma movimentação registrada.
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
                {recent.map((movement) => (
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

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
