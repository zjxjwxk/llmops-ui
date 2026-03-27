// 应用预览与调试接口响应
import type { BaseResponse } from '@/models/base.ts'

export type DebugAppResponse = BaseResponse<{
  content: string
}>
