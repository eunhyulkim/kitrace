/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'

const firstGoalMatcher: BroadCastMessageMatcher = (stats) => {
  if (stats.length < 10) return

  const templates = [
    '드디어 한 마리의 말이 골인했습니다!',
    '승자가 결정되었습니다!',
    '선두마가 결승선을 통과했습니다!',
    '마지막 순간에 화려하게 결승선을 통과한 말이 있습니다!',
    '한 경주마가 결승선을 넘었습니다!',
    '선두마가 승리의 기쁨을 만끽합니다.',
  ]

  const [prev, pprev, ppprev] = [
    stats[stats.length - 1]!,
    stats[stats.length - 2]!,
    stats[stats.length - 3]!,
  ]
  const isGoalSomeOne =
    (ppprev.items.every((p) => p.record === null) ||
      pprev.items.every((p) => p.record === null)) &&
    prev.items.some((p) => p.record !== null)

  if (!isGoalSomeOne) return

  return sample(templates)!
}

export default firstGoalMatcher
