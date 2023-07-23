export type Player = {
  name: string
  lane: number
  flag: number
  restDistance: number
  record: number | null
  handleUpdateRestDistance: (value: number) => void
}
