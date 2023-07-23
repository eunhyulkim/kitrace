import { format } from 'date-fns'
import { GameStatistics } from '../../types/Statistics'
import { compact, sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../types/Broadcast'
import randomMatcher from './matchers/randomMatchers'
import startLeadMatcher from './matchers/startLeadMatcher'
import firstGoalMatcher from './matchers/firstGoalMatcher'
import suddenRushMatcher from './matchers/suddenRushMatcher'
import potentialWinnerMatcher from './matchers/potentialWinnerMatcher'
import lastGoalMatcher from './matchers/lastGoalMatcher'
import neckAndNeckMatcher from './matchers/neckAndNeckMatcher'
import changeFirstMatcher from './matchers/changeFirstMatcher'
import startFallingMatcher from './matchers/startFallingMatcher'

export const createBroadMessage = (message: string) => {
  return { message, createdAt: Date.now() }
}

export const createInitialBroadMessage = ({ gameId }: { gameId: number }) => {
  const message = format(
    new Date(),
    `M월 d일, H시 mm분 제 ${gameId}경기 시작합니다.`
  )
  return createBroadMessage(message)
}

export const createBroadMessageFromStatistics = (stats: GameStatistics) => {
  if (stats.length === 0) return

  const messages = compact(
    broadCastMessageMatchers.map(([matcher, rate]) => {
      const message = matcher(stats)
      if (!message) return null

      return {
        message,
        rate,
      }
    })
  )

  if (messages.length === 0) return undefined

  const maxRate = Math.max(...messages.map((m) => m.rate))
  const message = sample(messages.filter((m) => m.rate === maxRate))
  return message ? createBroadMessage(message.message) : undefined
}

const broadCastMessageMatchers: Array<[BroadCastMessageMatcher, number]> = [
  [startLeadMatcher, 200],
  [startFallingMatcher, 150],
  [firstGoalMatcher, 200],
  [lastGoalMatcher, 200],
  [changeFirstMatcher, 100],
  [suddenRushMatcher, 50],
  [potentialWinnerMatcher, 50],
  [neckAndNeckMatcher, 50],
  [randomMatcher, 0],
]
