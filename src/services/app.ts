import { get, post, ssePost } from '@/utils/request.ts'
import type {
  CreateAppRequest,
  GetAppResponse,
  GetDebugConversationMessagesWithPageRequest,
  GetDebugConversationMessagesWithPageResponse,
  GetDraftAppConfigResponse,
  GetPublishHistoriesWithPageResponse,
  UpdateDraftAppConfigRequest,
} from '@/models/app.ts'
import type { BasePaginatorRequest, BaseResponse } from '@/models/base.ts'

// 获取应用信息
export const getApp = (app_id: string) => {
  return get<GetAppResponse>(`/apps/${app_id}`)
}

// 创建应用
export const createApp = (req: CreateAppRequest) => {
  return post<BaseResponse<{ id: string }>>(`/apps`)
}

// 获取应用草稿配置
export const getDraftAppConfig = (app_id: string) => {
  return get<GetDraftAppConfigResponse>(`/apps/${app_id}/draft-app-config`)
}

// 更新应用草稿配置
export const updateDraftAppConfig = (app_id: string, req: UpdateDraftAppConfigRequest) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/draft-app-config`, { body: req })
}

// 获取应用调试会话长期记忆
export const getDebugConversationSummary = (app_id: string) => {
  return get<BaseResponse<{ summary: string }>>(`/apps/${app_id}/summary`)
}

// 更新应用调试会话长期记忆
export const updateDebugConversationSummary = (app_id: string, summary: string) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/summary`, { body: summary })
}

// 应用调试会话
export const debugChat = (
  app_id: string,
  query: string,
  onData: (event_response: Record<string, any>) => void,
) => {
  return ssePost(`/apps/${app_id}/conversations`, { body: { query } }, onData)
}

// 停止应用调试会话
export const stopDebugChat = (app_id: string, task_id: string) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/conversations/tasks/${task_id}/stop`)
}

// 获取应用调试会话消息列表分页
export const getDebugConversationMessagesWithPage = (
  app_id: string,
  req?: GetDebugConversationMessagesWithPageRequest,
) => {
  return get<GetDebugConversationMessagesWithPageResponse>(
    `/apps/${app_id}/conversations/messages`,
    { params: req },
  )
}

// 删除应用调试会话记录
export const deleteDebugConversations = (app_id: string) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/conversations/delete-debug-conversation`)
}

// 发布应用配置
export const publish = (app_id: string) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/publish`)
}

// 取消应用发布
export const cancelPublish = (app_id: string) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/cancel-publish`)
}

// 获取应用发布历史列表分页
export const getPublishHistoriesWithPage = (app_id: string, req: BasePaginatorRequest) => {
  return get<GetPublishHistoriesWithPageResponse>(`/apps/${app_id}/publish-histories`, {
    params: req,
  })
}

// 回退应用历史配置到草稿
export const fallbackHistoryToDraft = (app_id: string, app_config_version_id: string) => {
  return post<BaseResponse<any>>(`/apps/${app_id}/fallback-history`, {
    body: { app_config_version_id },
  })
}

export const debugApp = (
  app_id: string,
  query: string,
  onData: (event_response: { [key: string]: any }) => void,
) => {
  return ssePost(
    `/apps/${app_id}/conversations`,
    {
      body: { query },
    },
    onData,
  )
}
