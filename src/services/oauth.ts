import { get, post } from '@/utils/request.ts'
import type { AuthorizeResponse, ProviderResponse } from '@/models/oauth.ts'

// 获取第三方OAuth地址
export const provider = (provider_name: string) => {
  return get<ProviderResponse>(`/oauth/${provider_name}`)
}

// 第三方OAuth登录
export const authorize = (provider_name: string, code: string) => {
  return post<AuthorizeResponse>(`/oauth/authorize/${provider_name}`, {
    body: { code },
  })
}
