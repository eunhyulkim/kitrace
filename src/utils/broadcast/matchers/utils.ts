import { GameStatistic } from '../../../types/Statistics'

export const getHorseByRank = (stat: GameStatistic, rank: number) => {
  return sortByRanks(stat)[rank - 1]
}

export const getHorseByName = (stat: GameStatistic, name: string) => {
  return stat.items.find((item) => item.name === name)
}

export const getRestPixelByName = (stat: GameStatistic, name: string) => {
  return getHorseByName(stat, name)?.restPixel ?? Number.MAX_SAFE_INTEGER
}

export const getPreviousStat = (stats: GameStatistic[], previous: number) => {
  return stats[stats.length - previous]
}

export const getRestPixelFromGame = (stat: GameStatistic) => {
  return Math.min(...stat.items.map((item) => item.restPixel))
}

export const sortByRanks = (stat: GameStatistic) => {
  return [...stat.items].sort((a, b) => a.restPixel - b.restPixel)
}

export const filterNotGoaled = (stat: GameStatistic) => {
  return [...stat.items.filter((item) => item.record === null)]
}

export const filterGoaled = (stat: GameStatistic) => {
  return [...stat.items.filter((item) => item.record !== null)]
}
