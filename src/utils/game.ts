import { PlayPhase } from '../types/Game'

export const calcPlayPhase = (restPixel: number) => {
  switch (true) {
    case restPixel > 1000:
      return PlayPhase.STARTING
    case restPixel > 600:
      return PlayPhase.FIRST_HALF
    case restPixel > 200:
      return PlayPhase.SECOND_HALF
    default:
      return PlayPhase.LAST
  }
}

export const calcMovePixelCallbackWithGameStatus = ({
  restPixel,
  speed,
}: {
  restPixel: number
  speed: number
}) => {
  const playPhase = calcPlayPhase(restPixel)

  switch (playPhase) {
    case PlayPhase.LAST: {
      return (prev: number) => prev + speed * 100 - 25
    }
    case PlayPhase.SECOND_HALF: {
      return (prev: number) => prev + speed * 100 - 40
    }
    case PlayPhase.FIRST_HALF: {
      return (prev: number) => prev + speed * 100 - 50
    }
    case PlayPhase.STARTING:
    default: {
      return (prev: number) => prev + speed * 100 - 30
    }
  }
}

export const pixelToDistance = (pixel: number) => {
  const PIXEL_TO_DISTANCE_RATIO = 5
  return Math.floor(pixel * PIXEL_TO_DISTANCE_RATIO)
}
