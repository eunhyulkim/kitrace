import React from 'react'
import { Player } from '../../types/Player'
import { keyframes, styled } from '../../stitches/stitches.config'
import { HORSE_BODY_PIXEL } from '../../constants/game'
import { pixelToDistance } from '../../utils/game'

const INTERVAL_MS_TO_CHECK_REST_DISTANCE = 500

const DistanceFlag: React.FC<{
  playersRef: React.MutableRefObject<Player[]>
}> = ({ playersRef }) => {
  const [restDistance, setRestDistance] = React.useState<number | null>(null)

  React.useEffect(() => {
    const clearId = window.setInterval(() => {
      const minPlayerRestPixel =
        playersRef.current.reduce(
          (acc, val) => Math.min(acc, val.restPixel),
          Number.MAX_SAFE_INTEGER
        ) + HORSE_BODY_PIXEL

      setRestDistance((prev) =>
        pixelToDistance(
          Math.max(
            prev === null
              ? minPlayerRestPixel
              : prev < minPlayerRestPixel
              ? prev - 0.2
              : minPlayerRestPixel,
            0
          )
        )
      )
    }, INTERVAL_MS_TO_CHECK_REST_DISTANCE)

    return () => {
      clearInterval(clearId)
    }
  }, [])

  return restDistance !== null ? (
    <Flag
      animate={
        restDistance > 1500 ? 'relax' : restDistance > 500 ? 'speed' : 'warning'
      }
    >
      {restDistance}m
    </Flag>
  ) : null
}

const FlagAnimation = keyframes({
  from: {
    textShadow:
      '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #FF9900, 0 0 70px #FF9900, 0 0 80px #FF9900, 0 0 100px #FF9900, 0 0 150px #FF9900',
  },
  to: {
    textShadow:
      '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #FF9900, 0 0 35px #FF9900, 0 0 40px #FF9900, 0 0 50px #FF9900, 0 0 75px #FF9900',
  },
})

const Flag = styled('div', {
  position: 'fixed',
  top: 30,
  left: 30,
  fontSize: '48px',
  color: '#FF9900',
  fontFamily: 'Audiowide',
  zIndex: 30,

  variants: {
    animate: {
      relax: {
        animation: `${FlagAnimation} 0.8s ease-in-out infinite alternate`,
      },
      speed: {
        animation: `${FlagAnimation} 0.3s ease-in-out infinite alternate`,
      },
      warning: {
        animation: `${FlagAnimation} 0.1s ease-in-out infinite alternate`,
      },
    },
  },

  defaultVariants: {
    animate: 'relax',
  },
})

export default DistanceFlag
