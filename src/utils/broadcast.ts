import { format } from 'date-fns'

export const createBroadMessage = (message: string) => {
  return { message, createdAt: Date.now() }
}

export const createInitialBroadMessage = ({ gameId }: { gameId: number }) => {
  const message = format(
    new Date(),
    `M월 d일, H시 mm분 제 ${gameId}경기 시작합니다.`
  )
  return createBroadMessage(message)
}
