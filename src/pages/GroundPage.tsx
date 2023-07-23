import React from 'react'
import { keyframes, styled } from '../stitches/stitches.config'
import CustomAppScreen from '../components/common/CustomAppScreen'
import Horse from '../components/pageGame/Horse'
import RegisterModal from '../components/pageGame/RegisterModal'
import ResultModal from '../components/pageGame/ResultModal'
import { Player } from '../types/Player'

const getLane = (totals: number, index: number) => {
  const usedLaneWidth = [
    0, 0, 100, 180, 270, 400, 450, 450, 460, 460, 470, 470, 480, 480, 480, 480,
    490, 490, 490, 500, 500,
  ]

  const width = usedLaneWidth[totals]
  return (500 - width) / 2 + index * (width / (totals - 1))
}

const GroundPage: React.FC = () => {
  const [isStart, setIsStart] = React.useState(false)
  const [gameId, setGameId] = React.useState(0)
  const playersRef = React.useRef<Player[]>([])

  const handleFormSubmit = React.useCallback(
    (names: string[]) => {
      const gameStartedAt = Date.now()
      const items = names.map((name, idx) => {
        const handleUpdateRestDistance = (value: number) => {
          const restDistance = value
          const player = playersRef.current.find(
            (player) => player.flag === idx + 1
          )

          if (!player || player.record !== null) return

          player.restDistance = restDistance

          if (restDistance <= -300) {
            player.record = Date.now() - gameStartedAt
            if (playersRef.current.every((player) => player.record !== null)) {
              setIsStart(false)
            }
          }
        }
        const lane = getLane(names.length, idx)
        return {
          name,
          restDistance: 2000,
          handleUpdateRestDistance,
          lane,
          record: null,
          flag: idx + 1,
        }
      })
      playersRef.current = items
      setIsStart(true)
    },
    [gameId]
  )

  const handleRestartClick = () => {
    playersRef.current = []
    setGameId((prev) => prev + 1)
  }

  return (
    <CustomAppScreen
      appBar={{
        border: false,
      }}
    >
      <Base>
        {isStart && <DistanceFlag playersRef={playersRef} />}
        <Floor />
        <RegisterModal
          isOpen={!isStart && !playersRef.current.length}
          onSubmit={handleFormSubmit}
        />
        <ResultModal
          isOpen={!isStart && !!playersRef.current.length}
          players={playersRef.current}
          onRestartClick={handleRestartClick}
        />
        {playersRef.current.map((player) => {
          return (
            <Horse
              key={player.name}
              players={playersRef.current}
              lane={player.lane}
              name={player.name}
              isRunning={isStart}
              onUpdateRestDistance={player.handleUpdateRestDistance}
            />
          )
        })}
      </Base>
    </CustomAppScreen>
  )
}

export default GroundPage

const DistanceFlag: React.FC<{
  playersRef: React.MutableRefObject<Player[]>
}> = ({ playersRef }) => {
  const [d, setD] = React.useState<number | null>(null)

  React.useEffect(() => {
    const clearId = window.setInterval(() => {
      const restDistance =
        playersRef.current.reduce(
          (acc, val) => Math.min(acc, val.restDistance),
          100000
        ) + 290

      setD((prev) =>
        Math.max(
          prev === null
            ? restDistance
            : prev < restDistance
            ? prev - 0.2
            : restDistance,
          0
        )
      )
    }, 500)

    return () => {
      clearInterval(clearId)
    }
  }, [])

  return d !== null ? (
    <Flag animate={d > 200 ? 'relax' : d > 0 ? 'speed' : 'warning'}>
      {Math.floor(d * 5)}m
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

const Base = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  background:
    '-webkit-gradient(linear, left bottom, left top, color-stop(30%, #ffa44e), to(#00d4ff))',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end',
})

const Floor = styled('div', {
  backgroundColor: '#f1d1af',
  background: 'linear-gradient(9deg, #e8d9be 0%, #a95108 100%)',
  position: 'fixed',
  top: 'calc(30vh + (2.5rem / 2) - 0.5rem)',
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
})
