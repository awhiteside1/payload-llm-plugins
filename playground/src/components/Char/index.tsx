import { ChatUI } from '@payload-llm-plugins/chat/ChatView'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { AdminViewProps } from 'payload'

const ChatView: React.FC<AdminViewProps> = (props) => {
  const { initPageResult, params, searchParams } = props

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <ChatUI {...props} />
    </DefaultTemplate>
  )
}

export default ChatView
