import * as Transports from '@/plugins/transports_ges'

import { GetterTree, MutationTree, ActionTree, Module } from 'vuex'
import { RootState } from '@/store/index'
import { mdiAirplane, mdiCar, mdiTrain, mdiBusMultiple } from '@mdi/js'
import { computeDistance } from '@/plugins/transports_distance'
import { computeGes } from '@/plugins/transports_ges'
import Vue from 'vue'

const modes = [
  { name: 'Voiture', icon: mdiCar },
  { name: 'Métro/Bus', icon: mdiBusMultiple },
  { name: 'TGV', icon: mdiTrain },
  { name: 'Avion', icon: mdiAirplane }
]
let id = 0

/**
 * State.
 */
export { Store as TransportsState } from '@/plugins/transports_ges'
const state: Transports.Store = {
  travels: [],
  modes,
  current_id: -1,
  ges: {
    total: 0,
    items: []
  }
}

/**
 * Getters.
 */
export const getters: GetterTree<Transports.Store, RootState> = {
  modes(state): string[] {
    return state.modes.map(mode => mode.name)
  },
  getIconByMode: state => (modeName: string) => {
    const mode = state.modes.find(mode => mode.name === modeName)
    return mode ? mode.icon : ''
  },
  getTravelCopy: state => (travelId: number) => {
    return JSON.parse(
      JSON.stringify(state.travels.find(travel => travel.id === travelId))
    )
  },
  getTravelsReguliers: state => {
    return state.travels.filter(travel => travel.type === 'Régulier')
  },
  getTravelsOccasionnels: state => {
    return state.travels.filter(travel => travel.type === 'Occasionnel')
  },
  getGes(state): Transports.GESCategory {
    const ges: Transports.GESCategory = { total: 0, items: [] }
    ges.items = state.travels.map(travel => {
      return {
        category: 'Transports',
        label: travel.name,
        value: travel.ges ? travel.ges : 0,
        ecogeste: travel.ecogeste
      }
    })
    ges.total = ges.items.reduce((s, c) => s + c.value, 0)
    return ges
  }
}

/**
 * Mutations.
 */
export const mutations: MutationTree<Transports.Store> = {
  insertTravel(state, travel: Transports.Travel): void {
    id++
    const newTravel = {
      ...travel,
      name: `${travel.departure.name} - ${travel.arrival.name} (${travel.mode})`,
      id
    }
    state.travels.push(JSON.parse(JSON.stringify(newTravel)))
  },
  updateTravel(state, new_travel: Transports.Travel): void {
    const travel_id = state.travels.findIndex(
      travel => travel.id === new_travel.id
    )
    const updated_travel = {
      ...new_travel,
      name: `${new_travel.departure.name} - ${new_travel.arrival.name} (${new_travel.mode})`
    }
    if (travel_id > -1) {
      Vue.set(state.travels, travel_id, updated_travel)
    }
  },
  deleteTravel(state, id: number): void {
    const travel_id = state.travels.findIndex(item => item.id === id)
    if (travel_id > -1) {
      Vue.delete(state.travels, travel_id)
    }
  },
  updateCurrentId(state, new_id: number): void {
    state.current_id = new_id
  }
}

/**
 * Actions.
 */
export const actions: ActionTree<Transports.Store, RootState> = {
  async insertTravel(context, travel: Transports.Travel): Promise<number> {
    travel = await computeDistance(travel)
    travel = await computeGes(travel)
    context.commit('insertTravel', travel)
    // ? Qu'est ce que je dois retourner ?
    return 1
  },
  async updateTravel(context, new_travel: Transports.Travel): Promise<number> {
    new_travel = await computeDistance(new_travel)
    new_travel = await computeGes(new_travel)
    context.commit('updateTravel', new_travel)
    // ? Qu'est ce que je dois retourner ?
    return 1
  },
  deleteTravel(context, travelId: number): void {
    context.commit('deleteTravel', travelId)
  },
  updateCurrentId(context, new_id: number): void {
    context.commit('updateCurrentId', new_id)
  }
}

/**
 * Modules.
 */
export const transports: Module<Transports.Store, RootState> = {
  namespaced: true,
  state: state,
  getters,
  mutations,
  actions
}
