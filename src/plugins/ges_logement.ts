import { GESCategory, GESItem, Ecogeste } from '@/store/modules/ges'
import * as factures from '@/plugins/ges_logement_factures'
import * as estimation from '@/plugins/ges_logement_estimation'

export interface GESItemLogement extends GESItem {
  metadata: {
    source: string
    usage: 'appliances' | 'heating' | 'all'
  }
}

export interface GESCategoryLogement extends GESCategory {
  items: GESItemLogement[]
}

export function ges_values() {
  // kg CO2 eq./kWh
  return {
    gaz: 0.234,
    elec: 0.049
  }
}
export const default_ecogeste: Ecogeste = {
  name: 'EcogesteLogement'
}

export interface UserForm {
  id: number
  type: 'factures' | 'estimation' | ''
  inputs: estimation.LogementFormEstimation | factures.LogementFormFactures
}

export interface Store {
  forms: UserForm[]
  ges: GESCategoryLogement
  next_form_id: number
}

function num(value: number): number {
  return isNaN(Number(value)) ? 0 : Number(value)
}

export const heating_options = estimation.heating_options
export const appliances_options = estimation.appliances_options
export const isolation_options = estimation.isolation_options
export const default_form_estimation = estimation.default_form
export const default_form_factures = factures.default_form

export function computeGes(forms: UserForm[]): GESCategoryLogement {
  const ges: GESCategoryLogement = {
    items: [],
    total: 0
  }

  forms.forEach(form => {
    let form_ges: GESCategoryLogement = {
      items: [],
      total: 0
    }
    if (form.type === 'factures') {
      form_ges = factures.computeGes(
        form.inputs as factures.LogementFormFactures
      )
    }
    if (form.type === 'estimation') {
      form_ges = estimation.computeGes(
        form.inputs as estimation.LogementFormEstimation
      )
    }
    ges.items.push(...form_ges.items)
    ges.total += form_ges.total
  })

  return ges
}