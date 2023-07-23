import { GameStatistics } from './Statistics'

export type BroadCastMessageMatcher = (
  stats: GameStatistics
) => string | undefined
