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

// 知识库召回测试请求
export type HitRequest = {
  retrieval_strategy: string
  k: number
  query: string
  score: number
}

// 知识库召回测试响应
export type HitResponse = BaseResponse<
  Array<{
    id: string
    document: {
      id: string
      name: string
      extension: string
      mime_type: string
    }
    dataset_id: string
    score: number
    position: number
    keywords: string[]
    character_count: number
    token_count: number
    hit_count: number
    enabled: boolean
    disabled_at: number
    status: string
    error: string
    updated_at: number
    created_at: number
  }>
>

// 知识库最近查询记录响应
export type GetDatasetQueriesResponse = BaseResponse<
  Array<{
    id: string
    query: string
    source: string
    dataset_id: string
    created_at: number
  }>
>

// 创建文档请求
export type CreateDocumentRequest = {
  upload_file_ids: string[]
  process_type: string
  rule: {
    pre_process_rules: {
      id: string
      enabled: boolean
    }[]
    segment: {
      separators: string[]
      chunk_size: number
      chunk_overlap: number
    }
  }
}

// 创建文档响应
export type CreateDocumentResponse = BaseResponse<{
  batch: string
  documents: {
    id: string
    name: string
    status: string
    created_at: number
  }[]
}>

// 获取文档处理进度
export type GetDocumentsStatusResponse = BaseResponse<
  Array<{
    id: string
    name: string
    size: number
    extension: string
    mime_type: string
    position: number
    segment_count: number
    completed_segment_count: number
    status: string
    error: string
    processing_started_at: number
    parsing_completed_at: number
    splitting_completed_at: number
    indexing_completed_at: number
    completed_at: number
    stopped_at: number
    created_at: number
  }>
>
