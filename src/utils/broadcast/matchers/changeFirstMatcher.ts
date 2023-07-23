/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import {
  filterGoaled,
  getPreviousStat,
  getRestPixelFromGame,
  sortByRanks,
} from './utils'
import { replaceWithJongSung } from '../../string'

const changeFirstMatcher: BroadCastMessageMatcher = (stats) => {
  if (stats.length < 2) return undefined

  const [prev, pprev] = [getPreviousStat(stats, 1), getPreviousStat(stats, 2)]
  const goaledHorses = filterGoaled(prev)
  const restPixel = getRestPixelFromGame(prev)
  if (goaledHorses.length > 0 || restPixel > 1200) return undefined

  const [prevFirst, pprevFirst] = [sortByRanks(prev)[0], sortByRanks(pprev)[0]]
  if (prevFirst.name === pprevFirst.name) return undefined

  const templates = [
    '강력한 스퍼트의 %1, 선두에 오르는 순간입니다!',
    '이제 선두로 올라서는 %1!',
    '%1이 %2를 제칩니다.',
    '%1가 놀라운 돌파력으로 %2를 앞섭니다.',
    '%1이 승부를 뒤집어 놓습니다!',
    '%1이 선두에 오르며 경기장을 뒤흔듭니다.',
    '%1에 의해 승부의 흐름이 바뀝니다!',
    '%1이 선두를 차지했습니다. 경기장이 들뜨고 있어요!',
    '%1이 %2를 능가하고 있습니다!',
    '%2가 왕좌에서 내려옵니다.',
    '누가 %1의 파워를 상상할 수 있었을까요!',
    '이제 경기장의 주인은 %1입니다!',
  ]

  const template = sample(templates)!

  const handleFirst = replaceWithJongSung(template, '%1', prevFirst.name)
  const handleSecond = replaceWithJongSung(handleFirst, '%2', pprevFirst.name)

  return handleSecond
}

export default changeFirstMatcher
