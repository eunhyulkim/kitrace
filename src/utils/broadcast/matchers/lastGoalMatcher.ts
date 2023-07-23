/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import { filterNotGoaled, getPreviousStat } from './utils'

const lastGoalMatcher: BroadCastMessageMatcher = (stats) => {
  const stat = getPreviousStat(stats, 1)
  const players = filterNotGoaled(stat)
  if (players.length > 2) return undefined
  const maxRestPixel = Math.max(...players.map((p) => p.restPixel))
  if (maxRestPixel > 200) return undefined

  const templates = [
    '마지막까지 최선을 다해 달려주세요!',
    '경기가 끝이 나고 있습니다.',
    '모두가 마지막 응원하고 있습니다. 화이팅!',
    '마지막 한 발을 단단히 밟아주세요!',
  ]

  return sample(templates)!
}

export default lastGoalMatcher
