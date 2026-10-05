import type { BaseResponse } from '@/models/base.ts'

// 获取第三方OAuth地址响应
export type ProviderResponse = BaseResponse<{
  redirect_url: string
}>

// 第三方OAuth登录响应
export type AuthorizeResponse = BaseResponse<{
  access_token: string
  expire_at: number
}>
