/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { last, sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import { filterNotGoaled, getRestPixelFromGame } from './utils'
import { withHasJongSung } from '../../string'
import { Player } from '../../../types/Player'

const neckAndNeckMatcher: BroadCastMessageMatcher = (stats) => {
  const stat = last(stats)!
  const nonGoaledHorses = filterNotGoaled(stat)
  const restPixels = getRestPixelFromGame(stat)
  if (nonGoaledHorses.length < 2 || restPixels > 1200) return

  const sortedHorses = [...nonGoaledHorses].sort(
    (a, b) => a.restPixel - b.restPixel
  )
  const horses = sortedHorses.reduce((acc, val, idx, arr) => {
    if (idx >= 3 || acc.length > 0 || idx === arr.length - 1) return acc
    const diff = Math.abs(val.restPixel - arr[idx + 1].restPixel)
    return diff <= 10 ? [val, arr[idx + 1]] : acc
  }, [] as Array<Player>)

  if (!horses.length) return

  const templates = [
    '%H의 치열한 경쟁을 눈여겨 보시죠.',
    '%H의 순위 경쟁은 정말 미지의 영역이에요.',
    '%H의 순위가 너무 비슷해서 눈을 뗄 수가 없네요.',
    '%H의 순위가 지독하게 비슷합니다!',
    '%H의 순위 경쟁이 점점 치열해지고 있습니다!',
    '%H 중에 누가 이길지 정말 예측하기 어렵네요.',
    '%H 때문에 경기장의 긴장감이 높아지네요.',
    '%H의 접전은 흔하지 않은 일인데요.',
    '%H의 경쟁은 판단하기가 어려워요.',
    '%H 간에 치열한 승부가 펼쳐지고 있습니다.',
  ]

  const template = sample(templates)!
  const [first, second] = horses
  return template.replace(
    '%H',
    `${withHasJongSung(first.name, '과', '와')} ${second.name}`
  )
}

export default neckAndNeckMatcher
