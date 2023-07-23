import React from 'react'
import ReactModal from 'react-modal'
import { styled } from '../../stitches/stitches.config'
import { Player } from '../../types/Player'
import { MS } from '../../constants/date'
import { fillZero } from '../../utils/string'
import html2canvas from 'html2canvas'
import { format } from 'date-fns'

type Props = {
  isOpen: boolean
  players: Player[]
  onRestartClick: () => void
}

const ResultModal: React.FC<Props> = ({ isOpen, players, onRestartClick }) => {
  const downloadContainerRef = React.useRef<HTMLDivElement>(null)
  const results = players.sort((a, b) => {
    if (a.record === null || b.record === null) {
      return a.record !== null
        ? -1
        : b.record !== null
        ? 1
        : a.restDistance - b.restDistance
    }

    return a.record - b.record
  })

  const handleDownloadClick = () => {
    const container = downloadContainerRef.current
    if (!container) return

    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL('image/png') // 캔버스를 이미지 데이터로 변환

      // a 태그를 이용하여 이미지 데이터를 다운로드
      const link = document.createElement('a')
      link.href = imgData
      link.download = `운명의_레이스_${format(new Date(), 'MMddhhmm')}.png`
      link.click()
    })
  }

  React.useEffect(() => {
    window.debug = format
  }, [])
  return (
    <ReactModal isOpen={isOpen} style={modalStyle} ariaHideApp={false}>
      <Base>
        <Content>
          <DownloadArea ref={downloadContainerRef}>
            <Title>레이스 결과</Title>
            {results.map((player, idx) => {
              const record =
                player.record === null
                  ? `${Math.max(player.restDistance * 5, 0)}m 남음`
                  : `${fillZero(
                      Math.floor(player.record / MS.MINUTE),
                      2
                    )}:${fillZero(
                      Math.floor((player.record % MS.MINUTE) / MS.SECOND),
                      2
                    )}:${fillZero(player.record % MS.SECOND, 2)}`

              return (
                <React.Fragment key={idx}>
                  <Item key={`${player.lane}-1`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-2`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-3`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-4`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-5`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-6`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-7`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-8`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-9`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-10`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-11`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                  <Item key={`${player.lane}-12`}>
                    <Rank>{idx + 1}</Rank>
                    <Name>{player.name}</Name>
                    <Record>{record}</Record>
                  </Item>
                </React.Fragment>
              )
            })}
          </DownloadArea>
          <SubmitButton onClick={onRestartClick}>다시하기</SubmitButton>
          <SubmitButton onClick={handleDownloadClick}>
            결과 다운로드
          </SubmitButton>
        </Content>
      </Base>
    </ReactModal>
  )
}

export default ResultModal

const Item = styled('div', {
  display: 'flex',
  background: '#F3F1F8',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: '8px',
  gap: '24px',
  margin: '10px 16px 0',

  '&:nth-of-type(2)': {
    background: '#acbafc',
  },

  '&:nth-of-type(3)': {
    background: '#cbd4ff',
  },

  '&:nth-of-type(4)': {
    background: '#e0e4fc',
  },
})

const Title = styled('div', {
  fontSize: '20px',
  color: '$gray900',
  fontWeight: 'bold',
  margin: '0 0 12px',
  padding: '16px',
})

const Rank = styled('div', {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '$gray800',
  textAlign: 'center',
  fontFamily: 'Audiowide',
  width: '20px',
})

const Name = styled('div', {
  fontSize: '14px',
  color: '$gray900',
  textAlign: 'center',
  flexGrow: 1,

  [`${Item}:nth-of-type(2) &`]: {
    fontWeight: 'bold',
  },
})

const Record = styled('div', {
  fontSize: '14px',
  color: '$gray900',
  fontWeight: 'bold',
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

const DownloadArea = styled('div', {
  padding: '0 0 16px',
})

const SubmitButton = styled('div', {
  background: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',

  '&:last-of-type': {
    margin: '8px 0 16px',
  },
})

const Base = styled('div', {
  background: 'white',
  overflow: 'scroll',
  maxWidth: '40vw',
  minWidth: '280px',
  maxHeight: '100%',
  borderRadius: '8px',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})
