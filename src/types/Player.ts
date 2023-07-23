export type Player = {
  name: string
  lane: number
  flag: number
  restPixel: number
  record: number | null
  handleUpdateRestDistance: (value: number) => void
}
