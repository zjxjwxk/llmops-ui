import type { BasePaginatorRequest, BasePaginatorResponse, BaseResponse } from '@/models/base.ts'

// 获取应用信息响应
export type GetAppResponse = BaseResponse<{
  id: string
  debug_conversation_id: string
  name: string
  icon: string
  description: string
  status: string
  draft_updated_at: number
  updated_at: number
  created_at: number
}>

// 创建应用请求
export type CreateAppRequest = { name: string; icon: string; description: string }

// 获取应用草稿配置响应
export type GetDraftAppConfigResponse = BaseResponse<{
  id: string
  model_config: { provider: string; model: string; parameters: Record<string, any> }
  dialog_round: number
  preset_prompt: string
  tools: {
    type: string
    provider: { id: string; name: string; label: string; icon: string; description: string }
    tool: {
      id: string
      name: string
      label: string
      description: string
      params: Record<string, any>
    }
  }[]
  workflows: { id: string; name: string; icon: string; description: string }[]
  datasets: { id: string; name: string; icon: string; description: string }[]
  retrieval_config: { retrieval_strategy: string; k: number; score: number }
  long_term_memory: { enable: boolean }
  opening_statement: string
  opening_questions: string[]
  speech_to_text: { enable: boolean }
  text_to_speech: { enable: boolean; voice: string; auto_play: boolean }
  review_config: {
    enable: boolean
    keywords: string[]
    inputs_config: { enable: boolean; preset_response: string }
    outputs_config: { enable: boolean }
  }
  updated_at: number
  created_at: number
}>

// 更新应用草稿配置请求
export type UpdateDraftAppConfigRequest = {
  model?: { provider: string; model: string; parameters: Record<string, any> }
  dialog_round?: number
  preset_prompt?: string
  tools?: { type: string; provider_id: string; tool_id: string; params: Record<string, any> }[]
  workflows?: string[]
  datasets?: string[]
  retrieval_config?: { retrieval_strategy: string; k: number; score: number }
  long_term_memory?: { enable: boolean }
  opening_statement?: string
  opening_questions?: string[]
  speech_to_text?: { enable: boolean }
  text_to_speech?: { enable: boolean; voice: string; auto_play: boolean }
  review_config?: {
    enable: boolean
    keywords: string[]
    inputs_config: { enable: boolean; preset_response: string }
    outputs_config: { enable: boolean }
  }
}

// 获取应用调试会话消息列表分页请求
export type GetDebugConversationMessagesWithPageRequest = BasePaginatorRequest & {
  created_at?: number
}

// 获取应用调试会话消息列表分页响应
export type GetDebugConversationMessagesWithPageResponse = BasePaginatorResponse<{
  id: string
  conversation_id: string
  query: string
  answer: string
  total_token_count: number
  latency: number
  agent_thought: {
    id: string
    position: string
    event: string
    thought: string
    observation: string
    tool: string
    tool_input: Record<string, any>
    latency: number
    created_at: number
  }[]
  created_at: number
}>

// 获取应用发布历史列表分页
export type GetPublishHistoriesWithPageResponse = BasePaginatorResponse<{
  id: string
  version: number
  created_at: number
}>
