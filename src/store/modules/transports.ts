import * as Transports from '@/plugins/transports_ges'

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

const store: Transports.Store = {
  travels: [],
  modes,
  current_id: -1,
  ges: {
    total: 0,
    items: []
  }
}

export default {
  namespaced: true,
  state: store,
  getters: {
    getModesNames(state: Transports.Store): string[] {
      return state.modes.map(mode => mode.name)
    },
    getIconByMode: (state: Transports.Store) => (modeName: string) => {
      const mode = state.modes.find(mode => mode.name === modeName)
      return mode ? mode.icon : ''
    },
    getTravelCopy: (state: Transports.Store) => (travelId: number) => {
      return JSON.parse(
        JSON.stringify(state.travels.find(travel => travel.id === travelId))
      )
    },
    getTravelsReguliers: (state: Transports.Store) => {
      return state.travels.filter(travel => travel.type === 'Régulier')
    },
    getTravelsOccasionnels: (state: Transports.Store) => {
      return state.travels.filter(travel => travel.type === 'Occasionnel')
    },
    getGes(state: Transports.Store): Transports.GESCategory {
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
  },
  mutations: {
    insertTravel(state: Transports.Store, travel: Transports.Travel): void {
      id++
      const newTravel = {
        ...travel,
        name: `${travel.departure.name} - ${travel.arrival.name} (${travel.mode})`,
        id
      }
      state.travels.push(JSON.parse(JSON.stringify(newTravel)))
    },
    updateTravel(state: Transports.Store, new_travel: Transports.Travel): void {
      const travel_id = state.travels.findIndex(
        travel => travel.id === new_travel.id
      )
      if (travel_id > -1) {
        Vue.set(state.travels, travel_id, new_travel)
      }
    },
    deleteTravel(state: Transports.Store, id: number): void {
      const travel_id = state.travels.findIndex(item => item.id === id)
      if (travel_id > -1) {
        Vue.delete(state.travels, travel_id)
      }
    },
    updateCurrentId(state: Transports.Store, new_id: number): void {
      state.current_id = new_id
    }
  },
  actions: {
    async insertTravel(
      context: any,
      travel: Transports.Travel
    ): Promise<number> {
      travel = await computeDistance(travel)
      travel = await computeGes(travel)
      context.commit('insertTravel', travel)
      // ? Qu'est ce que je dois retourner ?
      return 1
    },
    async updateTravel(
      context: any,
      new_travel: Transports.Travel
    ): Promise<number> {
      new_travel = await computeDistance(new_travel)
      new_travel = await computeGes(new_travel)
      context.commit('updateTravel', new_travel)
      // ? Qu'est ce que je dois retourner ?
      return 1
    },
    deleteTravel(context: any, travelId: number): void {
      context.commit('deleteTravel', travelId)
    },
    updateCurrentId(context: any, new_id: number): void {
      context.commit('updateCurrentId', new_id)
    }
  }
}
