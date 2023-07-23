import { styled } from '../../stitches/stitches.config'
import React from 'react'

type Props = Omit<JSX.IntrinsicElements['input'], 'ref'>

const FullSizeInput: React.FC<Props> = (props) => {
  return (
    <InputWrapper>
      <Input {...props} />
    </InputWrapper>
  )
}

export default FullSizeInput

const InputWrapper = styled('div', {
  display: 'flex',
  width: '100%',
})

const Input = styled('input', {
  width: '100%',
  border: '1px solid white',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '16px',

  '&:focus': {
    outline: 'none',
  },
})
