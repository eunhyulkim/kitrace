import { Player } from '../types/Player'

export const MOVE_HORSE_EVENT_KEY = 'MOVE_HORSE_EVENT'

export const dispatchMoveHorseEvent = ({
  name,
  players,
}: {
  name: string
  players: Player[]
}) => {
  const MoveHorseEvent = new CustomEvent(MOVE_HORSE_EVENT_KEY, {
    detail: {
      name,
      players,
    },
  })

  document.dispatchEvent(MoveHorseEvent)
}

export type MoveHorseEvent = CustomEvent<{ name: string; players: Player[] }>
