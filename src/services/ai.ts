import { post, ssePost } from '@/utils/request.ts'
import type { BaseResponse } from '@/models/base.ts'

// 优化Prompt
export const optimizePrompt = (
  prompt: string,
  onData: (event_response: Record<string, any>) => void,
) => {
  return ssePost(`/ai/optimize-prompt`, { body: { prompt } }, onData)
}

// 生成建议问题列表
export const generateSuggestedQuestions = (message_id: string) => {
  return post<BaseResponse<string[]>>(`/ai/suggested-questions`, { body: { message_id } })
}
