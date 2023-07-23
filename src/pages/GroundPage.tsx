import React from 'react'
import CustomAppScreen from '../components/common/CustomAppScreen'
import Horse from '../components/pageGame/horse/Horse'
import RegisterModal from '../components/pageGame/RegisterModal'
import ResultModal from '../components/pageGame/ResultModal'
import { useGameActions } from '../hooks/useGameActions'
import { GameStatus } from '../types/Game'
import BackgroundBase from '../components/pageGame/BackgroundBase'
import BackgroundFloor from '../components/pageGame/BackgroundFloor'
import DistanceFlag from '../components/pageGame/DistanceFlag'
import { styled } from '../stitches/stitches.config'

const GroundPage: React.FC = () => {
  const {
    status: gameStatus,
    playersRef,
    handleGameStartClick,
    handleGameResetClick,
    broadMessage,
  } = useGameActions({ useBroadCast: true })

  return (
    <CustomAppScreen
      appBar={{
        border: false,
      }}
    >
      <BackgroundBase>
        {gameStatus === GameStatus.PLAYING && (
          <DistanceFlag playersRef={playersRef} />
        )}
        <BackgroundFloor />
        <RegisterModal
          isOpen={gameStatus === GameStatus.READY}
          onSubmit={handleGameStartClick}
        />
        <ResultModal
          isOpen={gameStatus === GameStatus.END}
          players={playersRef.current}
          onRestartClick={handleGameResetClick}
        />
        {playersRef.current.map((player) => {
          return (
            <Horse
              key={player.name}
              playersRef={playersRef}
              name={player.name}
              isRunning={gameStatus === GameStatus.PLAYING}
            />
          )
        })}
        {!!broadMessage && <BroadcastMessage>{broadMessage}</BroadcastMessage>}
      </BackgroundBase>
    </CustomAppScreen>
  )
}

export default GroundPage

const BroadcastMessage = styled('div', {
  position: 'absolute',
  top: 30,
  left: '50%',
  fontSize: '24px',
  padding: '8px',
  borderRadius: '2px',
  transform: 'translateX(-50%)',
  background: '$gray900',
  color: '$gray00',
})
