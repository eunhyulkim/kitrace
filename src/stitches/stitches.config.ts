import { createStitches } from '@stitches/react'
import * as Stitches from '@stitches/react'
import { capitalize } from 'lodash'

export const typography = {
  title: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '135%',
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '150%',
  },
}

export const zIndices = {
  negative: -1,
  component1: 10,
  component2: 20,
  component3: 30,
  page1: 100,
  page2: 200,
  page3: 300,
  global1: 1000,
  global2: 2000,
  global3: 3000,
}

export const colors = {
  background: '#d33d39',
  gray900: '#212124',
  gray800: '#5f6268',
  gray600: '#868b94',
  gray400: '#f4f6fa',
  gray300: '#c8ccd0',
  gray100: '#e9e9e9',
  gray00: '#fafafc',
  red600: '#f0514d',
}

export const { styled, createTheme, config, css, keyframes, theme, globalCss } =
  createStitches({
    theme: {
      colors,
      zIndices,
    },
    utils: {
      safeAreaInset: (direction: 'top' | 'right' | 'bottom' | 'left') => ({
        [`padding${capitalize(
          direction
        )}`]: `constant(safe-area-inset-${direction})`,
        '&': {
          [`padding${capitalize(
            direction
          )}`]: `env(safe-area-inset-${direction})`,
        },
      }),
      boxShadow: (value: string) => ({
        boxShadow: value.includes('$') ? value.replace('$', '$colors$') : value,
      }),
      $background: (value: string) => ({
        background: value.includes('$')
          ? value.replace('$', '$colors$')
          : value,
      }),
      $text: (key: keyof typeof typography) => {
        return typography[key]
      },
    },
    media: {
      motion: '(prefers-reduced-motion: no-preference)',
      bp1: '(min-width: 640px)',
      bp2: '(min-width: 768px)',
      bp3: '(min-width: 1024px)',
    },
  })

export type StitchesCSS = Stitches.CSS<typeof config>
