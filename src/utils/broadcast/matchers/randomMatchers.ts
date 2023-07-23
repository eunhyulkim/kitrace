import { sample } from 'lodash'
import { BroadCastMessageMatcher } from '../../../types/Broadcast'

const randomMatcher: BroadCastMessageMatcher = (stats) => {
  const IS_INITIAL_LIVE_TIME = stats.length <= 2
  if (IS_INITIAL_LIVE_TIME) return

  const randomMessages = [
    '지금 경기장은 긴장감이 넘치는데요.',
    '어떤 결과가 기다릴지 정말 궁금합니다.',
    '재미있는 순간이에요.',
    '팬 여러분, 잘 보고 계신가요?',
    '열기가 멈추지 않고 있습니다.',
    '선수들의 열정에 눈이 부셔요.',
    '스릴에 눈을 떼기가 어렵습니다.',
    '팬 분들의 열정과 응원이 경기장을 뜨겁게 달구고 있습니다.',
    '모든 경주말들이 최고의 실력을 발휘하고 있어요.',
    '지금 이 순간을 기억해주세요.',
    '스피드와 역동성이 만나 멋진 경기가 펼쳐지고 있습니다.',
    '너무나 아름다운 경기입니다!',
    '경기장이 마치 에너지의 소용돌이에 휩싸인 듯해요!',
    '정말 짜릿하고 흥미진진해요!',
    '다들 승부욕이 불타오르고 있네요.',
    '시합이 치열하게 펼쳐지고 있어요.',
    '경주마들이 정말 스타일리시하네요.',
    '이런 열기, 또 어디에서 느낄 수 있을까요?',
    '마치 영화 속 장면처럼 멋진 경기가 펼쳐지고 있습니다.',
  ]

  return sample(randomMessages)
}

export default randomMatcher
