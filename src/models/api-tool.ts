import type { BasePaginatorResponse } from '@/models/base.ts'

// 获取自定义API工具提供商分页
export type GetApiToolProvidersWithPageResponse = BasePaginatorResponse<{
  id: string
  name: string
  icon: string
  description: string
  headers: Array<any>
  tools: Array<any>
  created_at: number
}>
