import React from 'react'
import { styled } from '../../../stitches/stitches.config'
import { Player } from '../../../types/Player'
import { percent } from '../../../utils/number'
import HorseElement from './HorseElement'
import { HORSE_BODY_PIXEL } from '../../../constants/game'
import { calcMovePixelCallbackWithGameStatus } from '../../../utils/game'
import { keyframes } from '@stitches/react'

type Props = {
  playersRef: React.MutableRefObject<Player[]>
  name: string
  isRunning?: boolean
}

const INTERVAL_MOVE_MS = 1000

const Horse: React.FC<Props> = ({ playersRef, name, isRunning }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [speed, setSpeed] = React.useState(0)
  const [distance, setDistance] = React.useState(0)

  const player = React.useMemo(
    () => playersRef.current.find((p) => p.name === name),
    [name]
  )

  const containerStyle = {
    top: `${200 + (player?.lane ?? 0)}px`,
    transition: 'right 1s linear',
    right: `calc(${distance}px - ${HORSE_BODY_PIXEL}px)`,
    '--speed': `${speed}s`,
    zIndex: player?.lane ?? 20,
  }

  const initialSpeed = React.useMemo(() => 0.5 + Math.random() * 0.3, [])

  React.useEffect(() => {
    let clearId: NodeJS.Timeout | null = null
    let prevSpeed = initialSpeed

    const callback = () => {
      const players = playersRef.current
      const totalH = players.length
      const currentRank =
        [...players]
          .sort((a, b) => a.restPixel - b.restPixel)
          .findIndex((p) => p.name === name) + 1
      const isLast = currentRank === totalH
      const direction = isLast
        ? 1
        : percent(Math.floor((100 / (totalH + 1)) * currentRank))
        ? 1
        : -1
      const range = direction > 0 ? 0.8 - prevSpeed : prevSpeed - 0.4
      const adjustment = range * Math.random()
      const nextSpeed = Math.min(
        Math.max(prevSpeed + direction * adjustment, 0.4),
        0.8
      )

      prevSpeed = nextSpeed
      setSpeed(nextSpeed)

      if (clearId) {
        clearTimeout(clearId)
      }

      clearId = setTimeout(callback, nextSpeed * 10000)
    }

    if (isRunning) {
      clearId = setTimeout(callback, prevSpeed * 10000)
      setSpeed(prevSpeed)
    } else {
      setSpeed(0)
      if (clearId) {
        clearTimeout(clearId)
        clearId = null
      }
    }

    return () => {
      if (clearId) {
        clearTimeout(clearId)
      }
    }
  }, [isRunning])

  React.useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      const rect = containerRef.current?.getBoundingClientRect()
      const COMPLETED_RACE_PIXEL = -500
      const restPixelToGoal = rect?.left

      if (
        restPixelToGoal === undefined ||
        restPixelToGoal < COMPLETED_RACE_PIXEL
      )
        return

      const movePixelCb = calcMovePixelCallbackWithGameStatus({
        restPixel: restPixelToGoal,
        speed,
      })

      setDistance(movePixelCb)
    }, INTERVAL_MOVE_MS)

    return () => clearInterval(id)
  }, [speed, isRunning])

  React.useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect?.left === undefined) return
    player?.handleUpdateRestDistance(rect.left)
  }, [distance])

  return (
    <HorseContainer
      ref={containerRef}
      className={!isRunning || speed === 0 ? '' : ' animate'}
      style={containerStyle}
    >
      <HorseElement />
      <Name>{name}</Name>
    </HorseContainer>
  )
}

export default Horse

const HorseContainer = styled('div', {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'visible',
  transition: 'transform 2s linear',
  opacity: 0,

  '&.animate': {
    opacity: 1,
  },
})

const NameAnimation = keyframes({
  '0%': {
    transform: 'rotate(-8deg) translatex(2%) translatey(-5%)',
  },
  '100%': {
    transform: 'rotate(-8deg) translatex(2%) translatey(-5%)',
  },
  '9%': {
    transform: 'rotate(-4deg) translatex(2%) translatey(0%)',
  },
  '18.1%': {
    transform: 'rotate(-1deg) translatex(0%) translatey(5%)',
  },
  '27.2%': {
    transform: 'rotate(-1deg) translatex(2%) translatey(0%) scaleX(0.92)',
  },
  '36.3%': {
    transform: 'rotate(0deg) translatex(2%) translatey(-2%) scaleX(0.9)',
  },
  '45.4%': {
    transform: 'rotate(-2deg) translatex(2%) translatey(-3%) scaleX(0.9)',
  },
  '54.5%': {
    transform: 'rotate(-3deg) translatex(2%) translatey(-5%) scaleX(0.9)',
  },
  '63.6%': {
    transform: 'rotate(-4deg) translatex(0%) translatey(-4%) scaleX(0.9)',
  },
  '72.7%': {
    transform: 'rotate(-4.5deg) translatex(0%) translatey(-3%) scaleX(0.95)',
  },
  '81.8%': {
    transform: 'rotate(-6.5deg) translatex(0%) translatey(-5%) scaleX(0.95)',
  },
  '90.9%': {
    transform: 'rotate(-10deg) translatex(0%) translatey(-14%) scaleX(1)',
  },
})

const Name = styled('div', {
  zIndex: 30,
  whiteSpace: 'nowrap',
  fontSize: '16px',
  fontWeight: 'bold',
  position: 'absolute',
  background: 'black',
  fontFamily: 'Audiowide',
  color: 'white',
  padding: '4px 6px 6px 6px',
  borderRadius: '4px',
  top: 44,
  left: 88,

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${NameAnimation}`,
  },
})
