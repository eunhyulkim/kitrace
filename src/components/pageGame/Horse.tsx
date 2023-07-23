import React from 'react'
import { keyframes, styled } from '../../stitches/stitches.config'
import { sample, random } from 'lodash'
import { Player } from '../../types/Player'
import { percent } from '../../utils/number'

type Props = {
  name?: string
  lane: number
  players: Player[]
  isRunning?: boolean
  onUpdateRestDistance?: (distance: number) => void
}

const COLOR_HORSE = '--color-horse'
const COLOR_HORSE_BACK = '--color-horse-back'
const COLOR_HAIR = '--color-hair'
const COLOR_HOOF = '--color-hoof'

const Horse: React.FC<Props> = ({
  players,
  lane,
  name,
  isRunning,
  onUpdateRestDistance,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [speed, setSpeed] = React.useState(0)
  const [distance, setDistance] = React.useState(0)
  const [colors, setColors] = React.useState({
    [COLOR_HORSE]: 'rgba(50, 50, 50, 1)',
    [COLOR_HORSE_BACK]: 'rgba(30, 30, 30, 1)',
    [COLOR_HAIR]: 'rgba(70, 70, 70, 1)',
    [COLOR_HOOF]: 'rgba(0, 0, 0, 1)',
  })

  const containerStyle = {
    top: `${200 + lane}px`,
    transition: 'right 1s linear',
    right: `calc(100px + ${distance}px)`,
    '--speed': `${speed}s`,
  }

  const horseStyle = {
    ...colors,
  } as React.CSSProperties

  const initialSpeed = React.useMemo(() => 0.5 + Math.random() * 0.3, [])

  React.useEffect(() => {
    const colorA = random(20, 235)
    const colorB = random(20, 235)
    const colorC = random(20, 235)

    setColors({
      [COLOR_HORSE]: `rgba(${colorA}, ${colorB}, ${colorC}, 1)`,
      [COLOR_HORSE_BACK]: `rgba(${colorA - 20}, ${colorB - 20}, ${
        colorC - 20
      }, 1)`,
      [COLOR_HAIR]: `rgba(${colorA + 20}, ${colorB + 20}, ${colorC + 20}, 1)`,
      [COLOR_HOOF]: `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(
        0,
        255
      )}, 1)`,
    })
  }, [])

  React.useEffect(() => {
    let clearId: NodeJS.Timeout | null = null
    let prevSpeed = initialSpeed

    const callback = () => {
      const totalH = players.length
      const currentRank =
        [...players]
          .sort((a, b) => a.restDistance - b.restDistance)
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
      if (rect === undefined || rect.left < -500) return

      const restDistance = rect.left
      switch (true) {
        case restDistance < 200: {
          setDistance((prev) => prev + speed * 100 - 30)
          break
        }
        case restDistance < 400: {
          setDistance((prev) => prev + speed * 100 - 35)
          break
        }
        case restDistance < 600: {
          setDistance((prev) => prev + speed * 100 - 40)
          break
        }
        case restDistance < 800: {
          setDistance((prev) => prev + speed * 100 - 45)
          break
        }
        case restDistance < 1000: {
          setDistance((prev) => prev + speed * 100 - 50)
          break
        }
        default: {
          setDistance((prev) => prev + speed * 100 - 55)
          break
        }
      }
    }, 1000)

    return () => clearInterval(id)
  }, [speed, isRunning])

  React.useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect?.left === undefined) return
    onUpdateRestDistance?.(rect.left)
  }, [distance])

  return (
    <HorseContainer
      ref={containerRef}
      className={!isRunning || speed === 0 ? '' : ' animate'}
      style={containerStyle}
    >
      <Base style={horseStyle}>
        <WholeBody className="🐴">
          <FrontRightLeg>
            <FrontLegShoulder>
              <FrontLegUpper>
                <FrontLegKnee>
                  <FrontLegLower>
                    <FrontLegAnkle>
                      <FrontLegFoot>
                        <FrontLegHoof />
                      </FrontLegFoot>
                    </FrontLegAnkle>
                  </FrontLegLower>
                </FrontLegKnee>
              </FrontLegUpper>
            </FrontLegShoulder>
          </FrontRightLeg>

          <BackRightLeg>
            <BackLegTop>
              <BackLegThigh>
                <BackLegLowerLeg>
                  <BackLegFoot>
                    <BackLegHoof />
                  </BackLegFoot>
                </BackLegLowerLeg>
              </BackLegThigh>
            </BackLegTop>
          </BackRightLeg>

          <Tail>
            <TailNub>
              <TailSection>
                <TailSection>
                  <TailSection>
                    <TailSection>
                      <TailSection>
                        <TailLastSection />
                      </TailSection>
                    </TailSection>
                  </TailSection>
                </TailSection>
              </TailSection>
            </TailNub>
          </Tail>

          <Body>
            <BodySection>
              <BodySection>
                <BodySection>
                  <BodySection>
                    <BodyLastSection />
                  </BodySection>
                </BodySection>
              </BodySection>
            </BodySection>
            <BodyBackSide />
          </Body>

          <Neck>
            <NeckUnder />
            <NeckFront />
            <NeckBase />
            <NeckTop />
            <NeckShoulder />
          </Neck>

          <FrontLeftLeg>
            <FrontLegShoulder>
              <FrontLegUpper>
                <FrontLegKnee>
                  <FrontLegLower>
                    <FrontLegAnkle>
                      <FrontLegFoot>
                        <FrontLegHoof />
                      </FrontLegFoot>
                    </FrontLegAnkle>
                  </FrontLegLower>
                </FrontLegKnee>
              </FrontLegUpper>
            </FrontLegShoulder>
          </FrontLeftLeg>

          <BackLeftLeg>
            <BackLegTop>
              <BackLegThigh>
                <BackLegLowerLeg>
                  <BackLegFoot>
                    <BackLegHoof />
                  </BackLegFoot>
                </BackLegLowerLeg>
              </BackLegThigh>
            </BackLegTop>
          </BackLeftLeg>

          <Head>
            <Skull />
            <Nose />
            <Face />
            <Lip />
            <Jaw />
            <Chin />
            <Ear />
            <Eye />
          </Head>
        </WholeBody>

        <FrontDust>
          <Particle1 />
          <Particle2 />
          <Particle3 />
          <Particle4 />
          <Particle5 />
          <Particle6 />
          <Particle7 />
          <Particle8 />
          <Particle9 />
          <Particle10 />
          <Particle11 />
          <Particle12 />
          <Particle13 />
          <Particle14 />
          <Particle15 />
          <Particle16 />
          <Particle17 />
          <Particle18 />
          <Particle19 />
          <Particle20 />
          <Particle21 />
          <Particle22 />
          <Particle23 />
          <Particle24 />
          <Particle25 />
          <Particle26 />
          <Particle27 />
          <Particle28 />
          <Particle29 />
          <Particle30 />
        </FrontDust>

        <BackDust>
          <Particle1 />
          <Particle2 />
          <Particle3 />
          <Particle4 />
          <Particle5 />
          <Particle6 />
          <Particle7 />
          <Particle8 />
          <Particle9 />
          <Particle10 />
          <Particle11 />
          <Particle12 />
          <Particle13 />
          <Particle14 />
          <Particle15 />
          <Particle16 />
          <Particle17 />
          <Particle18 />
          <Particle19 />
          <Particle20 />
          <Particle21 />
          <Particle22 />
          <Particle23 />
          <Particle24 />
          <Particle25 />
          <Particle26 />
          <Particle27 />
          <Particle28 />
          <Particle29 />
          <Particle30 />
        </BackDust>
      </Base>
      <Name>{`${name}(${
        players.find((p) => p.name === name)?.restDistance
      }m)`}</Name>
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

const Base = styled('div', {
  position: 'relative',
  fontsize: '22vmin',
  cursor: 'pointer',
  zIndex: 20,

  '--outlines:': 'transparent',
  '--delay-gap': 8,
  '--horse-width': '3.8rem',
  '--horse-height': '2.5rem',

  '--color-horse': 'rgba(50, 50, 50, 1)',
  '--color-horse-back': 'rgba(30, 30, 30, 1)',
  '--color-hair': 'rgba(70, 70, 70, 1)',
  '--color-hoof': 'rgba(0, 0, 0, 1)',

  '--color-dust': '#af540b',
  '--color-floor': '#f1d1af',
  '--color-sky': '#c4c4ff',

  '& *': {
    position: 'relative',
  },
})

const Name = styled('div', {
  zIndex: 30,
  whiteSpace: 'nowrap',
  fontSize: '16px',
  fontWeight: 'bold',
  position: 'absolute',
  background: 'black',
  color: 'white',
  padding: '4px 6px 6px 6px',
  borderRadius: '4px',
  top: 45,
  left: 250,
})

const WholeBody = styled('div', {
  width: 'var(--horse-width)',
  height: 'var(--horse-height)',
  border: '0px solid var(--outlines)',

  '& > *': {
    position: 'absolute',
    top: 'var(--part-y, 0)',
    left: 'var(--part-x, 0)',
    width: 'var(--part-width, 10px)',
    height: 'var(--part-height, 10px)',
    borderRadius: 'var(--part-radius, 0)',
    WebkitTransform: 'rotate(var(--part-rotate, 0deg))',
    transform: 'rotate(var(--part-rotate, 0deg))',
    WebkitTransformOrigin: 'var(--part-origin, 50% 50%)',
    transformOrigin: 'var(--part-origin, 50% 50%)',
    WebkitAnimationDelay: 'var(--delay, 0s) !important',
    animationDelay: 'var(--delay, 0s) !important',
  },

  '& *, *:after, *:before': {
    border: '1px dashed var(--outlines)',
  },

  '& * *, * *:after, * *:before': {
    position: 'absolute',
    backgroundColor: 'var(--color-horse)',
    top: 'var(--shape-y, 0)',
    left: 'var(--shape-x, 0)',
    width: 'var(--shape-width, 10px)',
    height: 'var(--shape-height, 10px)',
    borderRadius: 'var(--shape-radius, 0)',
    WebkitTransform: 'rotate(var(--shape-rotate, 0deg))',
    transform: 'rotate(var(--shape-rotate, 0deg))',
    WebkitTransformOrigin: 'var(--shape-origin, 50% 50%)',
    transformOrigin: 'var(--shape-origin, 50% 50%)',
    WebkitAnimationDelay: 'var(--delay, 0s) !important',
    animationDelay: 'var(--delay, 0s) !important',
  },
})

/* HEAD */

const HeadAnimation = keyframes({
  '0%': {
    transform: 'rotate(-45deg) translatex(-5%) translatey(10%)',
  },
  '100%': {
    transform: 'rotate(-45deg) translatex(-5%) translatey(10%)',
  },
  '16.6%': {
    transform: 'rotate(-45deg) translatex(0%) translatey(15%)',
  },
  '33.3%': {
    transform: 'rotate(-40deg) translatex(5%) translatey(23%)',
  },
  '49.9%': {
    transform: 'rotate(-36deg) translatex(15%) translatey(35%)',
  },
  '66.6%': {
    transform: 'rotate(-42deg) translatex(5%) translatey(35%)',
  },
  '83.3%': {
    transform: 'rotate(-45deg) translatex(-15%) translatey(10%)',
  },
})

const Head = styled('div', {
  '--part-width': '20%',
  '--part-height': '15%',
  '--part-x': '-1%',
  '--part-y': '3%',
  '--part-origin': '100% 50%',
  '--part-rotate': '-40deg',
  border: 'none',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${HeadAnimation}`,
  },
})

const Skull = styled('div', {
  '--shape-width': '55%',
  '--shape-height': '80%',
  '--shape-radius': '50%',
  '--shape-x': '43%',
  '--shape-y': '10%',
  '--shape-rotate': '40deg',
})

const Nose = styled('div', {
  '--shape-x': '0%',
  '--shape-y': '11.7%',
  '--shape-width': '24%',
  '--shape-height': '35%',
  '--shape-radius': '50%',
  '--shape-rotate': '-12deg',
})

const Face = styled('div', {
  '--shape-width': '47%',
  '--shape-height': '50%',
  '--shape-y': '8%',
  '--shape-x': '14%',
  '--shape-rotate': '-5deg',
})

const Lip = styled('div', {
  '--shape-rotate': '40deg',
  '--shape-x': '-3%',
  '--shape-y': '28%',
  '--shape-radius': '30%',
  '--shape-width': '12%',
  '--shape-height': '25%',
})

const Jaw = styled('div', {
  '--shape-width': '25%',
  '--shape-height': '60%',
  '--shape-x': '40%',
  '--shape-y': '37%',
  '--shape-radius': '45%',
  '-webkit-transform': 'skew(0deg) rotate(40deg)',
  transform: 'skew(0deg) rotate(40deg)',
})

const Chin = styled('div', {
  '--shape-width': '15%',
  '--shape-height': '40%',
  '--shape-y': '31%',
  '--shape-x': '2%',
  '--shape-radius': '30%',
  '--shape-rotate': '40deg',

  '&:after': {
    content: '',
    '--shape-width': '130%',
    '--shape-height': '180%',
    '--shape-radius': 0,
    '--shape-x': '123%',
    '--shape-y': '-95%',
    '--shape-rotate': '70deg',
  },
})

const EarAnimation = keyframes({
  '0%': {
    transform: 'rotate(25deg)',
  },
  '100%': {
    transform: 'rotate(25deg)',
  },
  '16.6%': {
    transform: 'rotate(28deg)',
  },
  '33.3%': {
    transform: 'rotate(24deg)',
  },
  '49.9%': {
    transform: 'rotate(30deg)',
  },
  '66.6%': {
    transform: 'rotate(35deg)',
  },
  '83.3%': {
    transform: 'rotate(35deg)',
  },
})

const Ear = styled('div', {
  '--shape-width': '20%',
  '--shape-height': '15%',
  '--shape-y': '17%',
  '--shape-x': '78%',
  '--shape-radius': '50%',
  '--shape-rotate': '10deg',
  '--shape-origin': '0% 50%',

  '&:after': {
    content: '',
    '--shape-width': '70%',
    '--shape-height': '40%',
    '--shape-y': '10%',
    '--shape-x': '65%',
    '--shape-radius': '40%',
    '--shape-rotate': '-30deg',
  },

  '&:before': {
    content: '',
    '--shape-width': '70%',
    '--shape-height': '30%',
    '--shape-y': '-20%',
    '--shape-x': '50%',
    '--shape-radius': '0%',
    '--shape-rotate': '-5deg',
  },

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${EarAnimation}`,
  },
})

const Eye = styled('div', {
  backgroundColor: 'var(--color-horse-back)',
  '--shape-width': '6%',
  '--shape-height': '10%',
  '--shape-radius': '30% 100%',
  '--shape-x': '45%',
  '--shape-y': '20%',
  '--shape-rotate': '0deg',
})

/* NECK */

const NeckAnimation = keyframes({
  '0%': {
    transform: 'scaleX(1) rotate(40deg) translatex(0%) translatey(-10%)',
  },
  '100%': {
    transform: 'scaleX(1) rotate(40deg) translatex(0%) translatey(-10%)',
  },
  '16.6%': {
    transform: 'scaleX(1) rotate(40deg) translatex(6%) translatey(-10%)',
  },
  '33.3%': {
    transform: 'scaleX(0.9) rotate(45deg) translatex(3%) translatey(5%)',
  },
  '49.9%': {
    transform: 'scaleX(0.85) rotate(45deg) translatex(3%) translatey(-5%)',
  },
  '66.6%': {
    transform: 'scaleX(0.85) rotate(40deg) translatex(0%) translatey(-15%)',
  },
  '83.3%': {
    transform: 'scaleX(1) rotate(35deg) translatex(0%) translatey(-15%)',
  },
})

const Neck = styled('div', {
  '--part-width': '30%',
  '--part-height': '25%',
  '--part-x': '5%',
  '--part-y': '35%',
  '--part-origin': '90% 50%',
  '--part-rotate': '45deg',
  border: 'none',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${NeckAnimation}`,
  },
})

const NeckUnder = styled('div', {
  '--shape-height': '40%',
  '--shape-width': '16%',
  '--shape-radius': '50%',
  '--shape-x': '11%',
  '--shape-y': '55%',
  '--shape-rotate': '-19deg',
  backgroundColor: 'transparent',
  borderTop: '0.07rem outset var(--color-horse)',
})

const NeckFront = styled('div', {
  '--shape-width': '75%',
  '--shape-height': '55%',
  '--shape-radius': '50%',
  '--shape-y': '28%',
  '--shape-x': '7%',
  '--shape-rotate': '20deg',
})

const NeckTop = styled('div', {
  '--shape-x': '10%',
  '--shape-y': '5%',
  '--shape-width': '50%',
  '--shape-height': '25%',
  '--shape-radius': '50% / 20%',
  '--shape-rotate': '0deg',

  '&:after': {
    content: "''",
    '--shape-x': '50%',
    '--shape-y': '-10%',
    '--shape-width': '70%',
    '--shape-height': '50%',
    '--shape-radius': '0%',
    '--shape-rotate': '-5deg',
  },
})

const NeckBase = styled('div', {
  '--shape-width': '50%',
  '--shape-height': '30%',
  '--shape-x': '20%',
  '--shape-y': '10%',
  '--shape-radius': '30%',
  '--shape-rotate': '-10deg',
})

const NeckShoulder = styled('div', {
  '--shape-width': '50%',
  '--shape-height': '30%',
  '--shape-x': '48%',
  '--shape-y': '-2%',
  '--shape-rotate': '-20deg',
  '--shape-radius': '50%',
})

/* Tail */

const TailAnimation = keyframes({
  '0%': {
    transform: 'rotate(-10deg) translatex(-5%) translatey(38%)',
  },
  '100%': {
    transform: 'rotate(-10deg) translatex(-5%) translatey(38%)',
  },
  '16.6%': {
    transform: 'rotate(-10deg) translatex(-5%) translatey(28%)',
  },
  '33.3%': {
    transform: 'rotate(-10deg) translatex(-10%) translatey(10%)',
  },
  '49.9%': {
    transform: 'rotate(-10deg) translatex(-10%) translatey(10%)',
  },
  '66.6%': {
    transform: 'rotate(-10deg) translatex(-10%) translatey(18%)',
  },
  '83.3%': {
    transform: 'rotate(-10deg) translatex(-10%) translatey(25%)',
  },
})

const Tail = styled('div', {
  '--part-width': '35%',
  '--part-height': '18%',
  '--part-x': '63%',
  '--part-y': '29%',
  '--part-rotate': '10deg',
  '--part-origin': '0% 50%',
  border: 'none',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${TailAnimation}`,
  },
})

const TailNub = styled('div', {
  '--shape-width': '35%',
  '--shape-height': '30%',
  '--shape-rotate': '4deg',
  '--shape-origin': '10% 50%',
  '--shape-radius': '20% / 50%',
  backgroundColor: 'var(--color-hair)',
})

const TailSectionAnimation1 = keyframes({
  '0%': {
    transform: 'rotate(15deg)',
  },
  '100%': {
    transform: 'rotate(15deg)',
  },
  '16.6%': {
    transform: 'rotate(15deg)',
  },
  '33.3%': {
    transform: 'rotate(12deg)',
  },
  '49.9%': {
    transform: 'rotate(5deg)',
  },
  '66.6%': {
    transform: 'rotate(0deg)',
  },
  '83.3%': {
    transform: 'rotate(5deg)',
  },
})

const TailSectionAnimation2 = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(0deg)',
  },
  '16.6%': {
    transform: 'rotate(4deg)',
  },
  '33.3%': {
    transform: 'rotate(15deg)',
  },
  '49.9%': {
    transform: 'rotate(30deg)',
  },
  '66.6%': {
    transform: 'rotate(10deg)',
  },
  '83.3%': {
    transform: 'rotate(-5deg)',
  },
})

const TailSectionAnimation3 = keyframes({
  '0%': {
    transform: 'rotate(-25deg)',
  },
  '100%': {
    transform: 'rotate(-25deg)',
  },
  '16.6%': {
    transform: 'rotate(-20deg)',
  },
  '33.3%': {
    transform: 'rotate(-20deg)',
  },
  '49.9%': {
    transform: 'rotate(-40deg)',
  },
  '66.6%': {
    transform: 'rotate(0deg)',
  },
  '83.3%': {
    transform: 'rotate(10deg)',
  },
})

const TailSection = styled('div', {
  '--shape-width': '100%',
  '--shape-height': '90%',
  '--shape-rotate': '15deg',
  '--shape-origin': '0% 50%',
  '--shape-radius': '30% / 50%',
  '--shape-y': '-25%',
  '--shape-x': '60%',
  backgroundColor: 'var(--color-hair)',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${TailSectionAnimation1}`,
  },

  '&:after': {
    content: "''",
    '--shape-width': '170%',
    '--shape-height': '120%',
    '--shape-rotate': '6deg',
    '--shape-origin': '0% 50%',
    '--shape-radius': '50%',
    '--shape-y': '-10%',
    '--shape-x': '0%',
    backgroundColor: 'transparent',
    boxShadow: '-1.5vmin 0.5vmin 0 0 var(--color-hair)',
  },

  '&:before': {
    content: "''",
    '--shape-width': '130%',
    '--shape-height': '100%',
    '--shape-rotate': '-20deg',
    '--shape-origin': '0% 50%',
    '--shape-radius': '50%',
    '--shape-y': '0%',
    '--shape-x': '50%',
    backgroundColor: 'transparent',
    boxShadow: '-1.5vmin 1vmin 0 0 var(--color-hair)',
  },

  [`${TailNub} > &`]: {
    '--shape-width': '50%',
    '--shape-height': '170%',
  },

  '& > * > *': {
    '--shape-rotate': '0deg',
    '--shape-height': '80%',
  },

  '.animate & > * > *': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${TailSectionAnimation2}`,
  },

  '& > * > * > * > *': {
    '--shape-rotate': '-25deg',
    '--shape-height': '40%',
  },

  '.animate & > * > * > * > *': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${TailSectionAnimation3}`,
  },
})

const TailLastSection = styled(TailSection, {})

/* Body */

const BodyAnimation = keyframes({
  '0%': {
    transform: 'rotate(8deg) translatex(2%) translatey(-5%)',
  },
  '100%': {
    transform: 'rotate(8deg) translatex(2%) translatey(-5%)',
  },
  '9%': {
    transform: 'rotate(4deg) translatex(2%) translatey(0%)',
  },
  '18.1%': {
    transform: 'rotate(1deg) translatex(0%) translatey(5%)',
  },
  '27.2%': {
    transform: 'rotate(1deg) translatex(2%) translatey(0%) scaleX(0.92)',
  },
  '36.3%': {
    transform: 'rotate(0deg) translatex(2%) translatey(-2%) scaleX(0.9)',
  },
  '45.4%': {
    transform: 'rotate(2deg) translatex(2%) translatey(-3%) scaleX(0.9)',
  },
  '54.5%': {
    transform: 'rotate(3deg) translatex(2%) translatey(-5%) scaleX(0.9)',
  },
  '63.6%': {
    transform: 'rotate(4deg) translatex(0%) translatey(-4%) scaleX(0.9)',
  },
  '72.7%': {
    transform: 'rotate(4.5deg) translatex(0%) translatey(-3%) scaleX(0.95)',
  },
  '81.8%': {
    transform: 'rotate(6.5deg) translatex(0%) translatey(-5%) scaleX(0.95)',
  },
  '90.9%': {
    transform: 'rotate(10deg) translatex(0%) translatey(-14%) scaleX(1)',
  },
})

const Body = styled('div', {
  '--part-width': '55%',
  '--part-height': '33%',
  '--part-x': '20%',
  '--part-y': '30%',
  '--part-origin': '10% 50%',
  border: 'none',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${BodyAnimation}`,
  },
})

const BodySection = styled('div', {
  '--shape-width': '94%',
  '--shape-height': '90%',
  '--shape-x': '40%',
  '--shape-y': '5%',
  '--shape-origin': '10% 30%',
  '--shape-radius': '50% 0 20% 20%',
  '--shape-rotate': '-9deg',

  [`${Body} > &`]: {
    '--shape-x': '4%',
    '--shape-y': '4%',
    '--shape-width': '32%',
    '--shape-height': '92%',
    '--shape-rotate': '10deg',
    '--shape-origin': '50% 50%',
    '--shape-radius': '45%',
  },

  [`${Body} > &:after`]: {
    content: "''",
    '--shape-height': '70%',
    '--shape-width': '202%',
    '--shape-x': '40%',
    '--shape-y': '48%',
    '--shape-rotate': '-23deg',
    '--shape-origin': '0% 100%',
    '--shape-radius': '50%',
  },
})

const BodyLastSection = styled(BodySection, {
  '--shape-radius': '45%',

  '&:after': {
    content: 'none',
  },
})

const BodyBackSide = styled('div', {
  '--shape-x': '60%',
  '--shape-y': '-10%',
  '--shape-width': '38%',
  '--shape-height': '70%',
  '--shape-origin': '0 0',
  '--shape-rotate': '8deg',
  '--shape-radius': '40% 50% 50%',
})

/* Front Leg */

const FrontLeg = styled('div', {
  '--part-width': '15%',
  '--part-height': '60%',
  '--part-x': '20%',
  '--part-y': '40%',
  '--part-origin': '100% 50%',
  border: 'none',
})

const FrontRightLeg = styled(FrontLeg, {
  '--color-horse': 'var(--color-horse-back)',
  '--delay': 'calc(0s - var(--speed) / var(--delay-gap))',
})

const FrontLeftLeg = styled(FrontLeg)

const FrontShoulderAnimation = keyframes({
  '0%': {
    WebkitTransform: 'rotate(20deg) translateX(0%) translateY(6%)',
    transform: 'rotate(20deg) translateX(0%) translateY(6%)',
  },
  '8.3%': {
    WebkitTransform: 'rotate(8deg) translateX(-10%) translateY(0%)',
    transform: 'rotate(8deg) translateX(-10%) translateY(0%)',
  },
  '16.6%': {
    WebkitTransform: 'rotate(0deg) translateX(-12%) translateY(-3%)',
    transform: 'rotate(0deg) translateX(-12%) translateY(-3%)',
  },
  '24.9%': {
    WebkitTransform: 'rotate(0deg) translateX(10%) translateY(0%)',
    transform: 'rotate(0deg) translateX(10%) translateY(0%)',
  },
  '33.3%': {
    WebkitTransform: 'rotate(-30deg) translateX(7%) translateY(-12%)',
    transform: 'rotate(-30deg) translateX(7%) translateY(-12%)',
  },
  '41.6%': {
    WebkitTransform: 'rotate(-30deg) translateX(11%) translateY(-10%)',
    transform: 'rotate(-30deg) translateX(11%) translateY(-10%)',
  },
  '49.9%': {
    WebkitTransform: 'rotate(-20deg) translateX(10%) translateY(0%)',
    transform: 'rotate(-20deg) translateX(10%) translateY(0%)',
  },
  '58.3%': {
    WebkitTransform: 'rotate(-10deg) translateX(30%) translateY(-5%)',
    transform: 'rotate(-10deg) translateX(30%) translateY(-5%)',
  },
  '66.6%': {
    WebkitTransform: 'rotate(15deg) translateX(25%) translateY(5%)',
    transform: 'rotate(15deg) translateX(25%) translateY(5%)',
  },
  '74.9%': {
    WebkitTransform: 'rotate(0deg) translateX(0%) translateY(0%)',
    transform: 'rotate(0deg) translateX(0%) translateY(0%)',
  },
  '83.3%': {
    WebkitTransform: 'rotate(0deg) translateX(0%) translateY(0%)',
    transform: 'rotate(0deg) translateX(0%) translateY(0%)',
  },
  '91.6%': {
    WebkitTransform: 'rotate(20deg) translateX(0%) translateY(0%)',
    transform: 'rotate(20deg) translateX(0%) translateY(0%)',
  },
  '100%': {
    WebkitTransform: 'rotate(20deg) translateX(0%) translateY(6%)',
    transform: 'rotate(20deg) translateX(0%) translateY(6%)',
  },
})

const FrontLegShoulder = styled('div', {
  '--shape-x': '20%',
  '--shape-width': '80%',
  '--shape-height': '35%',
  '--shape-origin': '100% 50%',
  '--shape-radius': '30% 30% 30% 50%',
  '--shape-rotate': '-0deg',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${FrontShoulderAnimation}`,
  },
})

const FrontLegUpperAnimation = keyframes({
  '0%': {
    transform: 'rotate(50deg) translatex(30%) translatey(8%)',
  },
  '100%': {
    transform: 'rotate(50deg) translatex(30%) translatey(8%)',
  },
  '8.3%': {
    transform: 'rotate(45deg) translatex(40%) translatey(10%)',
  },
  '16.6%': {
    transform: 'rotate(33deg) translatex(25%) translatey(10%)',
  },
  '24.9%': {
    transform: 'rotate(0deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(18deg) translatex(7%) translatey(10%)',
  },
  '41.6%': {
    transform: 'rotate(-8deg) translatex(-30%) translatey(15%)',
  },
  '49.9%': {
    transform: 'rotate(-4deg) translatex(-20%) translatey(10%)',
  },
  '58.3%': {
    transform: 'rotate(20deg) translatex(17%) translatey(10%)',
  },
  '66.6%': {
    transform: 'rotate(30deg) translatex(20%) translatey(-10%)',
  },
  '74.9%': {
    transform: 'rotate(75deg) translatex(40%) translatey(-15%)',
  },
  '83.3%': {
    transform: 'rotate(85deg) translatex(15%) translatey(-10%)',
  },
  '91.6%': {
    transform: 'rotate(55deg) translatex(25%) translatey(-5%)',
  },
})

const FrontLegUpper = styled('div', {
  '--shape-x': '40%',
  '--shape-y': '60%',
  '--shape-width': '40%',
  '--shape-height': '80%',
  '--shape-origin': '40% 10%',
  '--shape-radius': '30% 30% 50% 50%',
  '--shape-rotate': '0deg',

  '&:before': {
    content: "''",
    '--shape-x': '5%',
    '--shape-radius': '20%',
    '--shape-rotate': '0deg',
  },

  '&:after': {
    content: "''",
    '--shape-x': '40%',
    '--shape-y': '60%',
    '--shape-height': '78%',
    '--shape-radius': '40%',
    '--shape-rotate': '5deg',
  },

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${FrontLegUpperAnimation}`,
  },
})

const FrontLegKneeAnimation = keyframes({
  '0%': {
    transform: 'rotate(-15deg) translatex(0%) translatey(0%)',
  },
  '100%': {
    transform: 'rotate(-15deg) translatex(0%) translatey(0%)',
  },
  '8.3%': {
    transform: 'rotate(-10deg) translatex(0%) translatey(0%)',
  },
  '16.6%': {
    transform: 'rotate(-12deg) translatex(0%) translatey(0%)',
  },
  '24.9%': {
    transform: 'rotate(-20deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(-55deg) translatex(-25%) translatey(10%)',
  },
  '41.6%': {
    transform: 'rotate(-35deg) translatex(0%) translatey(-10%)',
  },
  '49.9%': {
    transform: 'rotate(-28deg) translatex(0%) translatey(0%)',
  },
  '58.3%': {
    transform: 'rotate(-90deg) translatex(-22%) translatey(0%)',
  },
  '66.6%': {
    transform: 'rotate(-95deg) translatex(-30%) translatey(0%)',
  },
  '74.9%': {
    transform: 'rotate(-98deg) translatex(-10%) translatey(0%)',
  },
  '83.3%': {
    transform: 'rotate(-80deg) translatex(-20%) translatey(8%)',
  },
  '91.6%': {
    transform: 'rotate(-50deg) translatex(-30%) translatey(10%)',
  },
})

const FrontLegKnee = styled('div', {
  '--shape-x': '0%',
  '--shape-y': '120%',
  '--shape-width': '57%',
  '--shape-height': '55%',
  '--shape-radius': '45%',
  '--shape-origin': '40% 20%',
  '--shape-rotate': '-0deg',

  '&:before': {
    content: "''",
    '--shape-x': '0%',
    '--shape-y': '60%',
    '--shape-width': '30%',
    '--shape-height': '40%',
    '--shape-radius': '30%',
    '--shape-rotate': '0deg',
  },

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${FrontLegKneeAnimation}`,
  },
})

const FrontLowerAnimation = keyframes({
  '0%': {
    transform: 'rotate(-25deg) translatex(20%) translatey(0%)',
  },
  '100%': {
    transform: 'rotate(-25deg) translatex(20%) translatey(0%)',
  },
  '8.3%': {
    transform: 'rotate(10deg) translatex(0%) translatey(-10%)',
  },
  '16.6%': {
    transform: 'rotate(10deg) translatex(0%) translatey(0%)',
  },
  '24.9%': {
    transform: 'rotate(12deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(-12deg) translatex(7%) translatey(-12%)',
  },
  '41.6%': {
    transform: 'rotate(0deg) translatex(0%) translatey(-10%)',
  },
  '49.9%': {
    transform: 'rotate(-23deg) translatex(20%) translatey(-20%)',
  },
  '58.3%': {
    transform: 'rotate(0deg) translatex(0%) translatey(-30%)',
  },
  '66.6%': {
    transform: 'rotate(-15deg) translatex(30%) translatey(-20%)',
  },
  '74.9%': {
    transform: 'rotate(-15deg) translatex(0%) translatey(0%)',
  },
  '83.3%': {
    transform: 'rotate(-15deg) translatex(15%) translatey(0%)',
  },
  '91.6%': {
    transform: 'rotate(-10deg) translatex(20%) translatey(-30%)',
  },
})

const FrontLegLower = styled('div', {
  '--shape-x': '0%',
  '--shape-y': '80%',
  '--shape-width': '54%',
  '--shape-height': '120%',
  '--shape-radius': '5%',
  '--shape-rotate': '12deg',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${FrontLowerAnimation}`,
  },
})

const FrontLegAnkleAnimation = keyframes({
  '0%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
  '100%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
  '8.3%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
  '16.6%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
  '24.9%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(15deg) translatex(10%) translatey(0%)',
  },
  '41.6%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
  '49.9%': {
    transform: 'rotate(0deg) translatex(0%) translatey(0%)',
  },
  '58.3%': {
    transform: 'rotate(0deg) translatex(0%) translatey(-20%)',
  },
  '66.6%': {
    transform: 'rotate(-30deg) translatex(0%) translatey(0%)',
  },
  '74.9%': {
    transform: 'rotate(-30deg) translatex(0%) translatey(0%)',
  },
  '83.3%': {
    transform: 'rotate(-10deg) translatex(0%) translatey(-20%)',
  },
  '91.6%': {
    transform: 'rotate(20deg) translatex(0%) translatey(0%)',
  },
})

const FrontLegAnkle = styled('div', {
  '--shape-x': '-20%',
  '--shape-y': '80%',
  '--shape-width': '170%',
  '--shape-height': '45%',
  '--shape-radius': '50%',
  '--shape-rotate': '20deg',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${FrontLegAnkleAnimation}`,
  },
})

const FrontLegFootAnimation = keyframes({
  '0%': {
    transform: 'rotate(-28deg) translatex(40%) translatey(0%)',
  },
  '100%': {
    transform: 'rotate(-28deg) translatex(40%) translatey(0%)',
  },
  '8.3%': {
    transform: 'rotate(-15deg) translatex(50%) translatey(0%)',
  },
  '16.6%': {
    transform: 'rotate(-11deg) translatex(35%) translatey(0%)',
  },
  '24.9%': {
    transform: 'rotate(50deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(-10deg) translatex(50%) translatey(0%)',
  },
  '41.6%': {
    transform: 'rotate(-36deg) translatex(50%) translatey(0%)',
  },
  '49.9%': {
    transform: 'rotate(-30deg) translatex(32%) translatey(0%)',
  },
  '58.3%': {
    transform: 'rotate(-30deg) translatex(45%) translatey(0%)',
  },
  '66.6%': {
    transform: 'rotate(-30deg) translatex(50%) translatey(0%)',
  },
  '74.9%': {
    transform: 'rotate(-30deg) translatex(50%) translatey(0%)',
  },
  '83.3%': {
    transform: 'rotate(-30deg) translatex(50%) translatey(0%)',
  },
  '91.6%': {
    transform: 'rotate(-50deg) translatex(50%) translatey(10%)',
  },
})

const FrontLegFoot = styled('div', {
  '--shape-x': '-35%',
  '--shape-y': '65%',
  '--shape-width': '120%',
  '--shape-height': '200%',
  '--shape-radius': '0%',
  '--shape-rotate': '30deg',
  WebkitClipPath:
    'polygon(0% 0%, 80% 0%, 65% 20%, 63% 30%, 70% 45%, 75% 55%, 46% 90%, 35% 95%, 10% 70%, 5% 50%, 10% 25%)',
  clipPath:
    'polygon(0% 0%, 80% 0%, 65% 20%, 63% 30%, 70% 45%, 75% 55%, 46% 90%, 35% 95%, 10% 70%, 5% 50%, 10% 25%)',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${FrontLegFootAnimation}`,
  },
})

const FrontLegHoof = styled('div', {
  '--shape-x': '40%',
  '--shape-y': '52%',
  '--shape-width': '100%',
  '--shape-height': '50%',
  '--shape-radius': '0%',
  '--shape-rotate': '55deg',
  backgroundColor: 'var(--color-hoof)',
})

/* Back Leg */

const BackLeg = styled('div', {
  '--part-width': '20%',
  '--part-height': '70%',
  '--part-x': '60%',
  '--part-y': '30%',
  '--part-origin': '100% 50%',
  border: 'none',
})

const BackLeftLeg = styled(BackLeg)

const BackRightLeg = styled(BackLeg, {
  '--color-horse': 'var(--color-horse-back)',
  '--delay': 'calc(0s - var(--speed) / var(--delay-gap))',
})

const BackLegTopAnimation = keyframes({
  '0%': {
    transform: 'rotate(0deg) translatex(-5%) translatey(50%)',
  },
  '100%': {
    transform: 'rotate(0deg) translatex(-5%) translatey(50%)',
  },
  '8.3%': {
    transform: 'rotate(-5deg) translatex(-7%) translatey(38%)',
  },
  '16.6%': {
    transform: 'rotate(-10deg) translatex(-14%) translatey(30%)',
  },
  '24.9%': {
    transform: 'rotate(25deg) translatex(0%) translatey(10%)',
  },
  '33.3%': {
    transform: 'rotate(32deg) translatex(-18%) translatey(25%)',
  },
  '41.6%': {
    transform: 'rotate(45deg) translatex(-5%) translatey(20%)',
  },
  '49.9%': {
    transform: 'rotate(65deg) translatex(10%) translatey(35%)',
  },
  '58.3%': {
    transform: 'rotate(65deg) translatex(10%) translatey(40%)',
  },
  '66.6%': {
    transform: 'rotate(75deg) translatex(20%) translatey(40%)',
  },
  '74.9%': {
    transform: 'rotate(70deg) translatex(20%) translatey(45%)',
  },
  '83.3%': {
    transform: 'rotate(60deg) translatex(25%) translatey(40%)',
  },
  '91.6%': {
    transform: 'rotate(30deg) translatex(10%) translatey(40%)',
  },
})

const BackLegTop = styled('div', {
  '--shape-height': '20%',
  '--shape-width': '75%',
  '--shape-radius': '45%',
  '--shape-rotate': '25deg',
  '--shape-x': '-8%',
  backgroundColor: 'transparent',

  '&:after': {
    content: "''",
    '--shape-height': '140%',
    '--shape-width': '40%',
    '--shape-radius': '50% / 30%',
    '--shape-rotate': '-19deg',
    '--shape-x': '55%',
    '--shape-y': '20%',
    '--shape-origin': '50% 10%',
  },

  '&:before': {
    content: "''",
    '--shape-height': '150%',
    '--shape-width': '80%',
    '--shape-radius': '50% / 60%',
    '--shape-rotate': '-60deg',
    '--shape-x': '24%',
    '--shape-y': '58%',
  },

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${BackLegTopAnimation}`,
  },
})

const BackLegThighAnimation = keyframes({
  '0%': {
    transform: 'rotate(-45deg) translatex(-30%) translatey(-10%)',
  },
  '100%': {
    transform: 'rotate(-45deg) translatex(-30%) translatey(-10%)',
  },
  '8.3%': {
    transform: 'rotate(-45deg) translatex(-30%) translatey(-8%)',
  },
  '16.6%': {
    transform: 'rotate(-43deg) translatex(-35%) translatey(-10%)',
  },
  '24.9%': {
    transform: 'rotate(-95deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(-115deg) translatex(0%) translatey(10%)',
  },
  '41.6%': {
    transform: 'rotate(-130deg) translatex(20%) translatey(-5%)',
  },
  '49.9%': {
    transform: 'rotate(-130deg) translatex(10%) translatey(0%)',
  },
  '58.3%': {
    transform: 'rotate(-90deg) translatex(80%) translatey(-20%)',
  },
  '66.6%': {
    transform: 'rotate(-85deg) translatex(0%) translatey(-20%)',
  },
  '74.9%': {
    transform: 'rotate(-65deg) translatex(5%) translatey(-10%)',
  },
  '83.3%': {
    transform: 'rotate(-65deg) translatex(10%) translatey(-10%)',
  },
  '91.6%': {
    transform: 'rotate(-75deg) translatex(-20%) translatey(-15%)',
  },
})

const BackLegThigh = styled('div', {
  '--shape-height': '140%',
  '--shape-width': '22%',
  '--shape-radius': '45% / 20%',
  '--shape-rotate': '-95deg',
  '--shape-x': '75%',
  '--shape-y': '172%',
  '--shape-origin': '50% 0%',

  '&:before': {
    content: "''",
    '--shape-height': '80%',
    '--shape-width': '50%',
    '--shape-radius': '50%',
    '--shape-rotate': '-15deg',
    '--shape-x': '-66%',
    '--shape-y': '-10%',
    '--shape-origin': '50% 0%',
  },

  '&:after': {
    content: "''",
    '--shape-height': '40%',
    '--shape-width': '50%',
    '--shape-radius': '50%',
    '--shape-rotate': '20deg',
    '--shape-x': '110%',
    '--shape-y': '23%',
    '--shape-origin': '50% 50%',
    backgroundColor: 'transparent',
    boxShadow: '-1.2% 0.5% 0 0 var(--color-horse)',
  },

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${BackLegThighAnimation}`,
  },
})

const BackLegLowerLegAnimation = keyframes({
  '0%': {
    transform: 'rotate(40deg) translatex(0%) translatey(0%)',
  },
  '100%': {
    transform: 'rotate(40deg) translatex(0%) translatey(0%)',
  },
  '8.3%': {
    transform: 'rotate(30deg) translatex(-30%) translatey(0%)',
  },
  '16.6%': {
    transform: 'rotate(28deg) translatex(-40%) translatey(0%)',
  },
  '24.9%': {
    transform: 'rotate(47deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(78deg) translatex(0%) translatey(5%)',
  },
  '41.6%': {
    transform: 'rotate(110deg) translatex(40%) translatey(10%)',
  },
  '49.9%': {
    transform: 'rotate(115deg) translatex(50%) translatey(5%)',
  },
  '58.3%': {
    transform: 'rotate(90deg) translatex(30%) translatey(5%)',
  },
  '66.6%': {
    transform: 'rotate(76deg) translatex(0%) translatey(0%)',
  },
  '74.9%': {
    transform: 'rotate(50deg) translatex(-40%) translatey(-4%)',
  },
  '83.3%': {
    transform: 'rotate(40deg) translatex(-20%) translatey(-5%)',
  },
  '91.6%': {
    transform: 'rotate(70deg) translatex(0%) translatey(0%)',
  },
})

const BackLegLowerLeg = styled('div', {
  '--shape-height': '100%',
  '--shape-width': '60%',
  '--shape-radius': '50% / 10%',
  '--shape-rotate': '47deg',
  '--shape-x': '80%',
  '--shape-y': '88%',
  '--shape-origin': '50% 0%',

  '&:after': {
    content: "''",
    '--shape-height': '60%',
    '--shape-width': '100%',
    '--shape-radius': '50%',
    '--shape-rotate': '-25deg',
    '--shape-x': '-155%',
    '--shape-y': '8%',
    '--shape-origin': '50% 50%',
    backgroundColor: 'transparent',
    boxShadow: '8px 1px 0 0 var(--color-horse)',
  },

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${BackLegLowerLegAnimation}`,
  },
})

const BackLegFootAnimation = keyframes({
  '0%': {
    transform: 'rotate(40deg) translatex(0%) translatey(-20%)',
  },
  '100%': {
    transform: 'rotate(40deg) translatex(0%) translatey(-20%)',
  },
  '8.3%': {
    transform: 'rotate(20deg) translatex(10%) translatey(-20%)',
  },
  '16.6%': {
    transform: 'rotate(-65deg) translatex(0%) translatey(0%)',
  },
  '24.9%': {
    transform: 'rotate(-70deg) translatex(0%) translatey(0%)',
  },
  '33.3%': {
    transform: 'rotate(-60deg) translatex(20%) translatey(-10%)',
  },
  '41.6%': {
    transform: 'rotate(-80deg) translatex(0%) translatey(0%)',
  },
  '49.9%': {
    transform: 'rotate(-70deg) translatex(0%) translatey(0%)',
  },
  '58.3%': {
    transform: 'rotate(-60deg) translatex(10%) translatey(-10%)',
  },
  '66.6%': {
    transform: 'rotate(-43deg) translatex(20%) translatey(-10%)',
  },
  '74.9%': {
    transform: 'rotate(-13deg) translatex(5%) translatey(-10%)',
  },
  '83.3%': {
    transform: 'rotate(8deg) translatex(5%) translatey(-15%)',
  },
  '91.6%': {
    transform: 'rotate(20deg) translatex(15%) translatey(-20%)',
  },
})

const BackLegFoot = styled('div', {
  '--shape-x': '-120%',
  '--shape-y': '100%',
  '--shape-width': '180%',
  '--shape-height': '60%',
  '--shape-radius': '0%',
  '--shape-rotate': '-70deg',
  WebkitClipPath:
    'polygon(90% 0%, 95% 10%, 100% 20%, 100% 30%, 60% 45%, 60% 55%, 70% 62%, 80% 65%, 80% 70%, 15% 95%, 10% 50%, 15% 25%, 30% 10%, 70% 0%)',
  clipPath:
    'polygon(90% 0%, 95% 10%, 100% 20%, 100% 30%, 60% 45%, 60% 55%, 70% 62%, 80% 65%, 80% 70%, 15% 95%, 10% 50%, 15% 25%, 30% 10%, 70% 0%)',

  '.animate &': {
    animationDuration: 'var(--speed)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: `${BackLegFootAnimation}`,
  },
})

const BackLegHoof = styled('div', {
  '--shape-x': '-10%',
  '--shape-y': '65%',
  '--shape-width': '100%',
  '--shape-height': '100%',
  '--shape-radius': '0%',
  '--shape-rotate': '-5deg',
  backgroundColor: 'var(--color-hoof)',
})

/* Dust */

const Dust = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: '0.02rem',
  //   bottom: `calc((var(--horse-height) / 2) + 0.02rem)`,
  overflow: 'visible',
})

const FrontDust = styled(Dust, {})

const BackDust = styled(Dust, {
  '&': {},
})

/* Particle */
const ParticleAnimation1 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.1865302066 * var(--horse-width))) translateY(calc(-0.0019510211 * (var(--horse-height) / 5))) scale(3) rotate(-126.5deg)',
    opacity: 0,
  },
})

const Particle = styled('div', {
  backgroundColor: 'var(--color-dust)',
  width: '0.05rem',
  height: '0.05rem',
  borderRadius: '50%',
  position: 'absolute',
  border: '1px dashed var(--outlines)',
  bottom: '0.1rem',
  left: '0.3rem',

  [`${BackDust} &`]: {
    left: '1.6rem',
  },
})

const Particle1 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.01s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation1}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.01s)',
  },
})

const ParticleAnimation2 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.0269289474 * var(--horse-width))) translateY(calc(-0.0005832403 * (var(--horse-height) / 5))) scale(4) rotate(-57.5deg)',
    opacity: 0,
  },
})

const Particle2 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.02s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation2}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.02s)',
  },
})

const ParticleAnimation3 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.2183341644 * var(--horse-width))) translateY(calc(-0.0011654604 * (var(--horse-height) / 5))) scale(6) rotate(-141deg)',
    opacity: 0,
  },
})

const Particle3 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.03s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation3}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.03s)',
  },
})

const ParticleAnimation4 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.516067634 * var(--horse-width))) translateY(calc(-0.0008606763 * (var(--horse-height) / 5))) scale(4) rotate(-108deg)',
    opacity: 0,
  },
})

const Particle4 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.04s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation4}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.04s)',
  },
})

const ParticleAnimation5 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.6010072872 * var(--horse-width))) translateY(calc(-0.0060810274 * (var(--horse-height) / 5))) scale(4) rotate(-76deg)',
    opacity: 0,
  },
})

const Particle5 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.05s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation5}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.05s)',
  },
})

const ParticleAnimation6 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.4536142004 * var(--horse-width))) translateY(calc(-0.0087663683 * (var(--horse-height) / 5))) scale(4) rotate(-75.5deg)',
    opacity: 0,
  },
})

const Particle6 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.06s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation6}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.06s)',
  },
})

const ParticleAnimation7 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3354709263 * var(--horse-width))) translateY(calc(-0.0063274995 * (var(--horse-height) / 5))) scale(4) rotate(-14deg)',
    opacity: 0,
  },
})

const Particle7 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.07s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation7}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.07s)',
  },
})

const ParticleAnimation8 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.7113461256 * var(--horse-width))) translateY(calc(-0.0099493652 * (var(--horse-height) / 5))) scale(6) rotate(-67.5deg)',
    opacity: 0,
  },
})

const Particle8 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.08s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation8}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.08s)',
  },
})

const ParticleAnimation9 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.080946473 * var(--horse-width))) translateY(calc(-0.0065291825 * (var(--horse-height) / 5))) scale(4) rotate(-38deg)',
    opacity: 0,
  },
})

const Particle9 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.09s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation9}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.09s)',
  },
})

const ParticleAnimation10 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.1470335732 * var(--horse-width))) translateY(calc(-0.0020159981 * (var(--horse-height) / 5))) scale(4) rotate(-152.5deg)',
    opacity: 0,
  },
})

const Particle10 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.1s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation10}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.1s)',
  },
})

const ParticleAnimation11 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3975218731 * var(--horse-width))) translateY(calc(-0.0075265158 * (var(--horse-height) / 5))) scale(4) rotate(-40.5deg)',
    opacity: 0,
  },
})

const Particle11 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.11s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation11}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.11s)',
  },
})

const ParticleAnimation12 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.6381622519 * var(--horse-width))) translateY(calc(-0.0067366122 * (var(--horse-height) / 5))) scale(5) rotate(-10deg)',
    opacity: 0,
  },
})

const Particle12 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.12s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation12}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.12s)',
  },
})

const ParticleAnimation13 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3130797386 * var(--horse-width))) translateY(calc(-0.0077930678 * (var(--horse-height) / 5))) scale(3) rotate(-122deg)',
    opacity: 0,
  },
})

const Particle13 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.13s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation13}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.13s)',
  },
})

const ParticleAnimation14 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.1034230215 * var(--horse-width))) translateY(calc(-0.0038184827 * (var(--horse-height) / 5))) scale(5) rotate(-150deg)',
    opacity: 0,
  },
})

const Particle14 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.14s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation14}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.14s)',
  },
})

const ParticleAnimation15 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.6811699412 * var(--horse-width))) translateY(calc(-0.0004574408 * (var(--horse-height) / 5))) scale(6) rotate(-105.5deg)',
    opacity: 0,
  },
})

const Particle15 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.15s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation15}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.15s)',
  },
})

const ParticleAnimation16 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3868914844 * var(--horse-width))) translateY(calc(-0.0059887576 * (var(--horse-height) / 5))) scale(6) rotate(-139.5deg)',
    opacity: 0,
  },
})

const Particle16 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.16s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation16}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.16s)',
  },
})

const ParticleAnimation17 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.1950402245 * var(--horse-width))) translateY(calc(-0.0056747992 * (var(--horse-height) / 5))) scale(5) rotate(-123.5deg)',
    opacity: 0,
  },
})

const Particle17 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.17s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation17}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.17s)',
  },
})

const ParticleAnimation18 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.108179063 * var(--horse-width))) translateY(calc(-0.0047562251 * (var(--horse-height) / 5))) scale(3) rotate(-81deg)',
    opacity: 0,
  },
})

const Particle18 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.18s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation18}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.18s)',
  },
})

const ParticleAnimation19 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.665064983 * var(--horse-width))) translateY(calc(-0.0047968338 * (var(--horse-height) / 5))) scale(5) rotate(-164deg)',
    opacity: 0,
  },
})

const Particle19 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.19s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation19}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.19s)',
  },
})

const ParticleAnimation20 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3799311838 * var(--horse-width))) translateY(calc(-0.0012141532 * (var(--horse-height) / 5))) scale(3) rotate(-22.5deg)',
    opacity: 0,
  },
})

const Particle20 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.2s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation20}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.2s)',
  },
})

const ParticleAnimation21 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.6391360309 * var(--horse-width))) translateY(calc(-0.009106735 * (var(--horse-height) / 5))) scale(3) rotate(-48.5deg)',
    opacity: 0,
  },
})

const Particle21 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.21s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation21}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.21s)',
  },
})

const ParticleAnimation22 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.5704055607 * var(--horse-width))) translateY(calc(-0.0003910802 * (var(--horse-height) / 5))) scale(6) rotate(-69.5deg)',
    opacity: 0,
  },
})

const Particle22 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.22s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation22}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.22s)',
  },
})

const ParticleAnimation23 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.5243436617 * var(--horse-width))) translateY(calc(-0.0087148752 * (var(--horse-height) / 5))) scale(4) rotate(-103deg)',
    opacity: 0,
  },
})

const Particle23 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.23s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation23}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.23s)',
  },
})

const ParticleAnimation24 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.1731283628 * var(--horse-width))) translateY(calc(-0.0092726604 * (var(--horse-height) / 5))) scale(6) rotate(-73deg)',
    opacity: 0,
  },
})

const Particle24 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.24s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation24}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.24s)',
  },
})

const ParticleAnimation25 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.0794815925 * var(--horse-width))) translateY(calc(-0.0068352112 * (var(--horse-height) / 5))) scale(6) rotate(-93.5deg)',
    opacity: 0,
  },
})

const Particle25 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.25s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation25}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.25s)',
  },
})

const ParticleAnimation26 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3962348094 * var(--horse-width))) translateY(calc(-0.0079345421 * (var(--horse-height) / 5))) scale(3) rotate(-56deg)',
    opacity: 0,
  },
})

const Particle26 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.26s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation26}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.26s)',
  },
})

const ParticleAnimation27 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.3415531831 * var(--horse-width))) translateY(calc(-0.0022188424 * (var(--horse-height) / 5))) scale(5) rotate(-153.5deg)',
    opacity: 0,
  },
})

const Particle27 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.27s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation27}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.27s)',
  },
})

const ParticleAnimation28 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.393523244 * var(--horse-width))) translateY(calc(-0.0088784406 * (var(--horse-height) / 5))) scale(6) rotate(-14deg)',
    opacity: 0,
  },
})

const Particle28 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.28s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation28}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.28s)',
  },
})

const ParticleAnimation29 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.5950931187 * var(--horse-width))) translateY(calc(-0.0052506571 * (var(--horse-height) / 5))) scale(5) rotate(-40deg)',
    opacity: 0,
  },
})

const Particle29 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.29s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation29}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.29s)',
  },
})

const ParticleAnimation30 = keyframes({
  '100%': {
    transform:
      'translateX(calc(0.1338113957 * var(--horse-width))) translateY(calc(-0.0052104567 * (var(--horse-height) / 5))) scale(5) rotate(-170deg)',
    opacity: 0,
  },
})

const Particle30 = styled(Particle, {
  transformOrigin: '-20% -20%',
  animationDelay: 'calc((var(--speed) * 0.1) + 0.3s)',
  animationDuration: 'var(--speed)',
  animationTimingFunction: 'ease-out',
  animationIterationCount: 'infinite',
  animationName: `${ParticleAnimation30}`,

  [`${BackDust} &`]: {
    animationDelay: 'calc((var(--speed) * 0.68) + 0.3s)',
  },
})
