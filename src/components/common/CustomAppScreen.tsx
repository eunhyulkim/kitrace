import { AppScreen } from '@stackflow/plugin-basic-ui'
import React from 'react'
import { useFlow } from '../../stackflow/stackflow'
import { AiOutlineLeft } from 'react-icons/ai'
import { styled } from '../../stitches/stitches.config'

type Props = Parameters<typeof AppScreen>[0]

const CustomAppScreen: React.FC<Props> = (props) => {
  const { pop } = useFlow()
  const { appBar, children, ...restProps } = props
  const { title, ...restAppBarProps } = appBar ?? ({} as any)

  return (
    <AppScreen
      appBar={{
        height: 0,
        title: title ?? '',
        backButton: {
          renderIcon: () => <AiOutlineLeft />,
          onClick: (e: React.MouseEvent) => {
            pop()
            e.preventDefault()
          },
        },
        ...restAppBarProps,
      }}
      {...restProps}
    >
      <Layout>{children}</Layout>
    </AppScreen>
  )
}

export default CustomAppScreen

const Layout = styled('div', {
  background: '$background',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
})
