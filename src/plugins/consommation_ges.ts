import { GesCategory } from '@/store/modules/ges'

export interface ConsommationItem {
  name: string
  full_name: string
  value: number
}

export enum Categories {
  'Vêtements',
  'High-tech',
  'Électroménager'
}

export interface Store {
  consommation: Record<string, ConsommationItem[]>
  ges: GesCategory
}

const vetements_ges: ConsommationItem[] = [
  { name: 'jeans', full_name: 'Jeans', value: 25 },
  { name: 'tee-shirt', full_name: 'Tee-shirt', value: 7 },
  { name: 'chemise', full_name: 'Chemise', value: 13 },
  { name: 'pull-acrylique', full_name: 'Pull acrylique', value: 28 },
  { name: 'pull-laine', full_name: 'Pull laine', value: 56 },
  { name: 'sweat-coton', full_name: 'Sweat coton', value: 31 },
  { name: 'robe', full_name: 'Robe', value: 56 },
  { name: 'manteau', full_name: 'Manteau', value: 89 },
  { name: 'chaussure', full_name: 'Chaussures', value: 19 }
]
const high_tech_ges: ConsommationItem[] = [
  { name: 'smartphone', full_name: 'Smartphone', value: 30 },
  { name: 'portable', full_name: 'Ordinateur portable', value: 156 },
  { name: 'fixe', full_name: 'Ordinateur fixe', value: 200 },
  { name: 'tele', full_name: 'Télévision', value: 350 }
]
const electromenager_ges: ConsommationItem[] = [
  { name: 'four', full_name: 'Four', value: 217 },
  { name: 'lave-vaisselle', full_name: 'Lave-vaisselle', value: 253 },
  { name: 'lave-linge', full_name: 'Lave-linge', value: 320 },
  { name: 'frigo', full_name: 'Réfrigérateur', value: 257 }
]

function getItemGesValue(arr: ConsommationItem[], item_name: string): number {
  const res = arr.find(item => item.name === item_name)
  return res ? res.value : 0
}
function mul(a: number, b: number): number {
  return a * b
}
function div(a: number, b: number): number {
  return b === 0 ? 0 : a / b
}

function computeGesByCategory(
  category: keyof typeof Categories,
  consommation: ConsommationItem[],
  ges_values: ConsommationItem[]
): number {
  let ges = 0
  const op = category === 'Vêtements' ? mul : div
  consommation.forEach(item => {
    ges += op(getItemGesValue(ges_values, item.name), item.value)
  })
  return ges
}

function computeGes(
  consommation: Record<string, ConsommationItem[]>
): GesCategory {
  const ges: GesCategory = { total: 0, items: [] }
  ges.items = [
    {
      name: 'Vêtements',
      ges: computeGesByCategory(
        'Vêtements',
        consommation['Vêtements'],
        vetements_ges
      )
    },
    {
      name: 'High-tech',
      ges: computeGesByCategory(
        'High-tech',
        consommation['High-tech'],
        high_tech_ges
      )
    },
    {
      name: 'Électroménager',
      ges: computeGesByCategory(
        'Électroménager',
        consommation['Électroménager'],
        electromenager_ges
      )
    }
  ]

  ges.total = ges.items.reduce((s, c) => s + c.ges, 0)

  return ges
}

const consommation: Record<string, ConsommationItem[]> = {
  vetements: vetements_ges.map(
    (item: ConsommationItem): ConsommationItem => {
      return { name: item.name, full_name: item.full_name, value: 0 }
    }
  ),
  high_tech: high_tech_ges.map(item => {
    return { name: item.name, full_name: item.full_name, value: 0 }
  }),
  electromenager: electromenager_ges.map(item => {
    return { name: item.name, full_name: item.full_name, value: 0 }
  })
}

export { consommation, computeGes }