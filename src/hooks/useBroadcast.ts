import React from 'react'
import { MOVE_HORSE_EVENT_KEY, MoveHorseEvent } from '../events/MoveHorseEvent'
import { format } from 'date-fns'
import { createInitialBroadMessage } from '../utils/broadcast'

type BroadMessage = {
  message: string
  createdAt: number
}

const BROAD_MESSAGE_INTERVAL_MS = 3000

type Props = {
  gameId: number
}

export const useBroadcast = ({ gameId }: Props) => {
  const [broadMessage, setBroadMessage] = React.useState<BroadMessage>()

  const handleReset = () => {
    setBroadMessage(undefined)
  }

  React.useEffect(() => {
    const eventHandler = (e: Event) => {
      const now = Date.now()
      const isBroadMessageLiveYet =
        !!broadMessage?.createdAt &&
        now - broadMessage.createdAt < BROAD_MESSAGE_INTERVAL_MS

      if (isBroadMessageLiveYet) return

      window.debug = format
      if (!broadMessage?.message) {
        setBroadMessage(createInitialBroadMessage({ gameId }))
        return
      }

      const event = e as MoveHorseEvent
      console.log('EVENT LISTEN: ', event.detail.name)
    }

    document.addEventListener(MOVE_HORSE_EVENT_KEY, eventHandler)

    return () => {
      document.removeEventListener(MOVE_HORSE_EVENT_KEY, eventHandler)
    }
  }, [broadMessage])

  return {
    message: broadMessage?.message,
    handleReset,
  }
}
