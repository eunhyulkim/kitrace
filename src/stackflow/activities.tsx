import React from 'react'
import GroundPage from '../pages/GroundPage'

export enum PageCode {
  GROUND = 'ground',
}

export type RouteInfo = {
  name: PageCode
  component: React.FC | (() => JSX.Element)
}

const items: Array<RouteInfo> = [
  {
    name: PageCode.GROUND,
    component: GroundPage,
  },
]

export const activities = Object.fromEntries(
  items.map((item) => [item.name, item.component])
)

export const routes = Object.fromEntries(
  items.map((item) => [item.name, `/${item.name}`])
)

export type TypeActivities = typeof activities
