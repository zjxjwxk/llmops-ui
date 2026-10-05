import type { BaseResponse } from '@/models/base.ts'

// 账号密码登录响应
export type PasswordLoginResponse = BaseResponse<{
  access_token: string
  expire_at: number
}>
