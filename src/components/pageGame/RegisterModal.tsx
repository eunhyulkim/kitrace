import React from 'react'
import ReactModal from 'react-modal'
import FullSizeInput from '../base/FullSizeInput'
import { styled } from '../../stitches/stitches.config'
import Spacer from '../base/Spacer'

type Props = {
  isOpen: boolean
  onSubmit: (names: string[]) => void
}

const RegisterModal: React.FC<Props> = ({ isOpen, onSubmit }) => {
  const [names, setNames] = React.useState<string[]>([])
  const itemCount = Math.min(names.length >= 2 ? names.length + 1 : 2, 20)
  const createHandleInputChange =
    (nth: number) => (e: React.FormEvent<HTMLInputElement>) => {
      const name = e.currentTarget.value
      if (!name) {
        setNames((prev) => {
          const next = [...prev]
          next[nth] = ''
          return next.filter((name) => !!name)
        })
      } else if (nth > names.length) {
        setNames((prev) => [...prev, name])
      } else {
        setNames((prev) => {
          const next = [...prev]
          next[nth] = name
          return next
        })
        names[nth] = name
      }
    }

  const createHandleKeyDown = (nth: number) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const input = document.querySelector(`input[name=player-${nth + 1}]`)
      if (input) {
        const _input = input as HTMLInputElement
        _input.focus()
      }
    } else if (e.key === 'Backspace') {
      const input = document.querySelector(`input[name=player-${nth}]`)
      const previousInput = document.querySelector(
        `input[name=player-${nth - 1}]`
      )

      if (input) {
        const _input = input as HTMLInputElement
        if (!_input.value && previousInput) {
          const _previousInput = previousInput as HTMLInputElement
          _previousInput.focus()
        }
      }
    }
  }

  const handleSubmit = () => {
    const handledNames = names.filter((name) => !!name)
    if (handledNames.length < 2) return
    onSubmit(handledNames)
  }

  return (
    <ReactModal isOpen={isOpen} style={modalStyle} ariaHideApp={false}>
      <Base>
        <Title>복불복 레이스</Title>
        {new Array(itemCount).fill(0).map((_, idx) => {
          const handleInputChange = createHandleInputChange(idx)
          const handleKeyDown = createHandleKeyDown(idx)

          return (
            <Item key={idx}>
              <FullSizeInput
                value={names[idx] ?? ''}
                onKeyDown={handleKeyDown}
                onInput={handleInputChange}
                placeholder="이름"
                name={`player-${idx}`}
              />
              <Spacer h={8} />
            </Item>
          )
        })}
        <SubmitButton onClick={handleSubmit}>시작하기</SubmitButton>
      </Base>
    </ReactModal>
  )
}

export default RegisterModal

const Item = styled('div', {
  flexShrink: 0,
})

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 10,
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.45)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    outline: 'none',
    zIndex: 10,
  },
} as const

const Title = styled('div', {
  fontSize: '20px',
  color: 'white',
  fontWeight: 'bold',
  margin: '0 0 12px',
})

const SubmitButton = styled('div', {
  background: '#FF6F0F',
  padding: '10px 0',
  borderRadius: '6px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '14px',
  margin: '8px 0 0',
  cursor: 'pointer',
  color: 'white',
})

const Base = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'scroll',
  height: '100%',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})
