/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { last, sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import { filterGoaled, getHorseByRank, getRestPixelFromGame } from './utils'
import { withHasJongSung } from '../../string'

const potentialWinnerMatcher: BroadCastMessageMatcher = (stats) => {
  const stat = last(stats)!
  const goaledHorses = filterGoaled(stat)
  const restPixels = getRestPixelFromGame(stat)
  if (goaledHorses.length > 0 || restPixels > 400) return

  const [first, second] = [getHorseByRank(stat, 1), getHorseByRank(stat, 2)]
  const diff = Math.abs(first.restPixel - second.restPixel)
  const isEnoughGap = diff > 80

  const winnerTemplates = [
    '%1, 눈에 띄게 선두를 지킵니다.',
    '멋진 경기력으로 경주를 주도하는 %1',
    '%1의 압도적인 우위입니다.',
    '%1의 승리가 가까워지고 있습니다.',
    '마치 날아가듯이 달리는 %1',
    '%1의 경기력은 정말 멋지네요.',
    '%1의 리드는 언제까지 계속될까요?',
    '지금 이 순간의 주인공은 %1!',
    '%1의 탁월한 경기력.',
  ]

  const drawTemplates = [
    '%H, 목숨을 건 듯이 달리네요.',
    '%H, 어느 말이 우승할지 예측이 어렵네요.',
    '%H의 속도가 비슷합니다.',
    '%H의 차이가 정말 작네요.',
    '승리를 향한 %H의 열정이 지독합니다.',
    '%H 모두 경기에서 최선을 다하고 있습니다.',
  ]

  const template = sample(isEnoughGap ? winnerTemplates : drawTemplates)!
  return template
    .replace('%1', first.name)
    .replace('%2', second.name)
    .replace('%H', `${withHasJongSung(first.name, '과', '와')} ${second.name}`)
}

export default potentialWinnerMatcher
