import React from 'react'
import { styled } from '../../stitches/stitches.config'

interface Props {
  w?: number
  h?: number
}

const Spacer: React.FC<Props> = ({ w, h }) => {
  return (
    <SpacerElement
      css={{ width: w ? `${w}px` : '100%', height: h ? `${h}px` : '100%' }}
    />
  )
}

export default Spacer

const SpacerElement = styled('div')
