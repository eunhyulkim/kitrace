/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import { getHorseByRank, getPreviousStat } from './utils'
import { replaceWithJongSung } from '../../string'

const startFallingMatcher: BroadCastMessageMatcher = (stats) => {
  const templates = [
    '시작 속도가 늦은 %H',
    '%H가 뒤쳐집니다. 어떤 이유일까요?',
    '%H의 출발 속도가 느려서 순위에서 밀립니다.',
    '느린 출발의 %H, 이유가 뭘까요?',
    '%H, 시작이 걱정스러운데요.',
    '뒤처지는 %H, 시작은 좋지 않습니다.',
    '경쟁에서 밀려나는 %H',
  ]

  if (stats.length <= 5 || stats.length >= 9) return

  const stat = getPreviousStat(stats, 1)
  const horse = getHorseByRank(stat, stat.items.length)

  const template = sample(templates)!
  return replaceWithJongSung(template, '%H', horse.name)
}

export default startFallingMatcher
