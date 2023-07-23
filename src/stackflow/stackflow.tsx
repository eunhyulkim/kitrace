import { basicUIPlugin } from '@stackflow/plugin-basic-ui'
import { historySyncPlugin } from '@stackflow/plugin-history-sync'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow, useActions } from '@stackflow/react'
import { colors } from '../stitches/stitches.config'

import { TypeActivities, PageCode, activities, routes } from './activities'

const appBar = {
  borderColor: 'white',
  textColor: 'white',
  iconColor: 'white',
  overflow: 'visible',
}

export const { Stack, useStepFlow } = stackflow({
  transitionDuration: 350,
  activities,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: 'cupertino',
      backgroundColor: colors.background,
      appBar,
    }),
    historySyncPlugin({
      routes,
      fallbackActivity: () => PageCode.GROUND,
      urlPatternOptions: { segmentValueCharset: 'a-zA-Z0-9-_~ %=' },
    }),
  ],
})

export const useFlow = () => {
  return useActions<TypeActivities>()
}
