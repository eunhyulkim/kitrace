/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'
import { getPreviousStat, getRestPixelByName } from './utils'

const suddenRushMatcher: BroadCastMessageMatcher = (stats) => {
  const templates = [
    '%H의 강력한 스피드!',
    '갑자기 빠른 속도를 내는 %H!',
    '%H의 속도가 경기장에 흥분을 채워놓고 있어요.',
    '%H의 갑작스러운 질주! 힘이 넘치네요.',
    '숨기고 있던 속도를 발휘하는 %H!',
    '자신의 한계를 뛰어넘는 %H!',
    '놀라운 속도의 %H!',
    '환상적인 속도를 내는 %H!',
    '%H의 스피드가 눈에 돋보입니다.',
  ]

  if (stats.length <= 5) return

  const [prev, pprev] = [getPreviousStat(stats, 1), getPreviousStat(stats, 2)]
  const players = [...prev.items.filter((item) => item.record === null)].sort(
    (a, b) => {
      const aPP = getRestPixelByName(pprev, a.name)
      const bPP = getRestPixelByName(pprev, b.name)

      return bPP - b.restPixel - (aPP - a.restPixel)
    }
  )

  const player = players[0]
  if (!player || player.restPixel < 0) return

  const movedDistance =
    getRestPixelByName(pprev, player.name) -
    getRestPixelByName(prev, player.name)
  const isNotEnoughSpeedy = movedDistance < 25
  if (isNotEnoughSpeedy) return

  const template = sample(templates)!
  return template.replace('%H', player.name)
}

export default suddenRushMatcher
