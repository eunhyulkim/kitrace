import React from 'react'
import { styled } from '../../stitches/stitches.config'

type Props = Omit<JSX.IntrinsicElements['div'], 'ref'>

const BackgroundBase: React.FC<Props> = ({ children, ...props }) => {
  const bgTime: React.ComponentProps<typeof Base>['time'] =
    React.useMemo(() => {
      const hour = new Date().getHours()
      switch (true) {
        case hour >= 22 && hour < 5:
          return 'night'
        case hour >= 5 && hour < 8:
          return 'dawn'
        case hour >= 8 && hour < 12:
          return 'morning'
        case hour >= 12 && hour < 18:
          return 'afternoon'
        case hour >= 18 && hour < 22:
          return 'evening'
        default:
          return 'morning'
      }
    }, [])

  return (
    <Base time={bgTime} {...props}>
      {children}
    </Base>
  )
}

export default BackgroundBase

const Base = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end',

  variants: {
    time: {
      dawn: {
        background:
          '-webkit-gradient(linear, left bottom, left top, color-stop(30%, #ffa44e), to(#b8cafe))',
      },
      morning: {
        background:
          '-webkit-gradient(linear, left bottom, left top, color-stop(30%, #ffa44e), to(#4ae7ff))',
      },
      afternoon: {
        background:
          '-webkit-gradient(linear, left bottom, left top, color-stop(30%, #ffa44e), to(#fff7ef))',
      },
      evening: {
        background:
          '-webkit-gradient(linear, left bottom, left top, color-stop(30%, #ffa44e), to(#fa8df6))',
      },
      night: {
        background:
          '-webkit-gradient(linear, left bottom, left top, color-stop(30%, #ffa44e), to(#030303))',
      },
    },
  },

  defaultVariants: {
    time: 'morning',
  },
})
