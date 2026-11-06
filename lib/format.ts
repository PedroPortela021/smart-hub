const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

export function formatCurrency(value: number | string | { toString(): string }) {
  return currency.format(Number(value))
}

export function formatDateTime(value: Date) {
  return dateTime.format(value)
}

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}
