import type { BasePaginatorResponse, BaseResponse } from '@/models/base.ts'

// 获取知识库列表分页响应
export type GetDatasetsWithPageResponse = BasePaginatorResponse<{
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

// 新增知识库请求
export type CreateDatasetRequest = {
  name: string
  icon: string
  description: string
}

// 更新知识库请求
export type UpdateDatasetRequest = {
  name: string
  icon: string
  description: string
}

// 获取知识库详情响应
export type GetDatasetResponse = BaseResponse<{
  id: string
  name: string
  icon: string
  description: string
  document_count: number
  hit_count: number
  related_app_count: number
  character_count: number
  updated_at: number
  created_at: number
}>

// 获取文档列表分页请求
export type GetDocumentsWithPageRequest = {
  current_page: number
  page_size: number
  search_word: string
}

// 获取文档列表分页响应
export type GetDocumentsWithPageResponse = BasePaginatorResponse<{
  id: string
  name: string
  character_count: number
  hit_count: number
  position: number
  enabled: boolean
  disabled_at: number
  status: string
  error: string
  updated_at: number
  created_at: number
}>

// 获取文档详情响应
export type GetDocumentResponse = BaseResponse<{
  id: string
  dataset_id: string
  name: string
  segment_count: number
  character_count: number
  hit_count: number
  position: number
  enabled: boolean
  disabled_at: number
  status: string
  error: string
  updated_at: number
  created_at: number
}>
