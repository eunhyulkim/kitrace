import React from 'react'
import { GameStatus } from '../types/Game'
import { Player } from '../types/Player'
import { createPlayer } from '../models/player'
import { useBroadcast } from './useBroadcast'

const INITIAL_GAME_ID = 1

type useGameActionsProps = {
  useBroadCast?: boolean
}

export const useGameActions = ({ useBroadCast }: useGameActionsProps = {}) => {
  const [gameId, setGameId] = React.useState(INITIAL_GAME_ID)
  const [status, setStatus] = React.useState<GameStatus>(GameStatus.READY)
  const playersRef = React.useRef<Player[]>([])
  const { message: broadMessage, handleReset: handleBroadCastReset } =
    useBroadcast({ gameId })

  const handleGameStartClick = React.useCallback(
    (names: string[]) => {
      const gameStartedAt = Date.now()
      const players = names.map((name, idx) =>
        createPlayer({
          name,
          flag: idx + 1,
          playersRef,
          gameStartedAt,
          totalPlayerCount: names.length,
          onGameEndClick: handleGameEndClick,
        })
      )
      playersRef.current = players
      setStatus(GameStatus.PLAYING)
    },
    [gameId]
  )

  const handleGameEndClick = () => {
    setStatus(GameStatus.END)
  }

  const handleGameResetClick = () => {
    playersRef.current = []
    setGameId((prevId) => prevId + 1)
    setStatus(GameStatus.READY)
    handleBroadCastReset()
  }

  return {
    gameId,
    status,
    playersRef,
    broadMessage: useBroadCast ? broadMessage : undefined,
    handleGameStartClick,
    handleGameEndClick,
    handleGameResetClick,
  }
}
