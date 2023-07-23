import React from 'react'
import { MOVE_HORSE_EVENT_KEY, MoveHorseEvent } from '../events/MoveHorseEvent'
import {
  createBroadMessageFromStatistics,
  createInitialBroadMessage,
} from '../utils/broadcast/broadcast'
import { GameStatistic, GameStatistics } from '../types/Statistics'
import { cloneDeep, last } from 'lodash'
import { MS } from '../constants/date'

type BroadMessage = {
  message: string
  createdAt: number
}

const BROAD_MESSAGE_INTERVAL_MS = 3000

type Props = {
  gameId: number
}

export const useBroadcast = ({ gameId }: Props) => {
  const [stats, setStats] = React.useState<GameStatistics>([])
  const [broadMessage, setBroadMessage] = React.useState<BroadMessage>()

  const handleReset = () => {
    setBroadMessage(undefined)
    setStats([])
  }

  React.useEffect(() => {
    const eventHandler = (e: Event) => {
      const event = e as MoveHorseEvent

      setStats((prev) => {
        const newStat = {
          items: cloneDeep(event.detail.players),
          time: Date.now(),
        }

        const isEmpty = prev.length === 0
        if (isEmpty) {
          return [newStat]
        }

        const recentStats = prev.slice(0, 100)
        const uploadStatRecently =
          Date.now() - (last(recentStats) as unknown as GameStatistic).time <
          1 * MS.SECOND
        if (uploadStatRecently) {
          return prev
        }

        return [...recentStats, newStat]
      })
    }

    document.addEventListener(MOVE_HORSE_EVENT_KEY, eventHandler)

    return () => {
      document.removeEventListener(MOVE_HORSE_EVENT_KEY, eventHandler)
    }
  }, [])

  React.useEffect(() => {
    const now = Date.now()
    const isBroadMessageLiveYet =
      !!broadMessage?.createdAt &&
      now - broadMessage.createdAt < BROAD_MESSAGE_INTERVAL_MS

    if (isBroadMessageLiveYet) return

    if (!broadMessage?.message) {
      setBroadMessage(createInitialBroadMessage({ gameId }))
      return
    }

    const message = createBroadMessageFromStatistics(stats)
    if (message) {
      setBroadMessage(message)
    }
  }, [stats, broadMessage])

  return {
    message: broadMessage?.message,
    handleReset,
  }
}
