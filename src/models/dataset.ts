// 获取知识库列表分页响应
import type { BasePaginatorResponse } from '@/models/base.ts'

export type GetDatasetsWithPageResp = BasePaginatorResponse<{
  id: string
  name: string
  icon: string
  description: string
  document_count: number
  character_count: number
  related_app_count: number
  updated_at: number
  created_at: number
}>
