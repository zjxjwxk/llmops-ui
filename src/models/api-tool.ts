import type { BasePaginatorResponse } from '@/models/base.ts'

// 获取自定义API工具提供商分页响应
export type GetApiToolProvidersWithPageResponse = BasePaginatorResponse<{
  id: string
  name: string
  icon: string
  description: string
  headers: Array<any>
  tools: Array<any>
  created_at: number
}>

// 创建自定义AIP工具提供商请求
export type CreateApiToolProviderRequest = {
  name: string
  icon: string
  openapi_schema: string
  headers: Array<any>
}

// 更新自定义AIP工具提供商请求
export type UpdateApiToolProviderRequest = {
  name: string
  icon: string
  openapi_schema: string
  headers: Array<any>
}

// 获取自定义AIP工具提供商响应
export type GetApiToolProviderResponse = {
  id: string
  name: string
  openapi_schema: string
  headers: Array<any>
  created_at: number
}
