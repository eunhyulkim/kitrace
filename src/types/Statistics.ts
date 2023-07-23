import { Player } from './Player'

export type HorseStatistic = Player

export type GameStatistic = {
  items: HorseStatistic[]
  time: number
}

export type GameStatistics = Array<GameStatistic>
