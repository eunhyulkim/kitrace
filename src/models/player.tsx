import React from 'react'
import { Player } from '../types/Player'
import { HORSE_BODY_PIXEL } from '../constants/game'
import { dispatchMoveHorseEvent } from '../events/MoveHorseEvent'

export const createPlayer = ({
  flag,
  name,
  totalPlayerCount,
  gameStartedAt,
  playersRef,
  onGameEndClick,
}: {
  flag: number
  name: string
  totalPlayerCount: number
  gameStartedAt: number
  playersRef: React.MutableRefObject<Player[]>
  onGameEndClick: () => void
}) => {
  const handleUpdateRestDistance = (value: number) => {
    const restPixel = value
    const player = playersRef.current.find((player) => player.flag === flag)

    if (!player || player.record !== null) return

    player.restPixel = restPixel
    dispatchMoveHorseEvent({
      name: player.name,
      players: [...playersRef.current],
    })

    if (restPixel <= -HORSE_BODY_PIXEL) {
      player.record = Date.now() - gameStartedAt
      const isGoaled = (player: Player) => player.record !== null
      if (playersRef.current.every(isGoaled)) {
        onGameEndClick()
      }
    }
  }

  const lane = getLane(totalPlayerCount, flag)

  return {
    name,
    flag,
    restPixel: Number.MAX_SAFE_INTEGER,
    handleUpdateRestDistance,
    lane,
    record: null,
  }
}

const getLane = (totals: number, flag: number) => {
  const usedLaneWidth = [
    0, 0, 100, 180, 270, 400, 450, 450, 460, 460, 470, 470, 480, 480, 480, 480,
    490, 490, 490, 500, 500,
  ]

  const width = usedLaneWidth[totals]
  return (500 - width) / 2 + (flag - 1) * (width / (totals - 1))
}
