/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { first, sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import { getHorseByRank } from './utils'
import { withHasJongSung } from '../../string'

const startLeadMatcher: BroadCastMessageMatcher = (stats) => {
  const templates = [
    '와, 경기 시작부터 폭발적인 속도로 나아가는 것은 바로 %H입니다!',
    '초반에 선두를 잡은 것은 %H!',
    '%H, 출발이 빠릅니다.',
    '%H의 치고 나가는 속도가 섬뜩하네요.',
    '눈에 먼저 들어오는 건 %H',
    '압도적인 속도의 선두, %H!',
    '시작하자마자 선두를 잡은 말은 %H',
    '%H의 빠른 출발이 모두를 놀라게 하네요.',
    '믿기 어려운 속도로 치고 나오는 %H!',
  ]

  if (stats.length <= 2 || stats.length >= 5) return

  const [firstH, secondH] = [
    getHorseByRank(first(stats)!, 1),
    getHorseByRank(first(stats)!, 2),
  ]

  const template = sample(templates)!

  const diff = Math.abs(firstH.restPixel - secondH.restPixel)
  const name =
    diff < 10
      ? `${withHasJongSung(firstH.name, '과', '와')} ${secondH.name}`
      : firstH.name

  return template.replace('%H', name)
}

export default startLeadMatcher
