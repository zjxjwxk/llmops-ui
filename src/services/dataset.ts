import { get, post } from '@/utils/request.ts'
import type {
  CreateDatasetRequest,
  CreateDocumentRequest,
  CreateDocumentResponse,
  GetDatasetQueriesResponse,
  GetDatasetResponse,
  GetDatasetsWithPageResponse,
  GetDocumentResponse,
  GetDocumentsStatusResponse,
  GetDocumentsWithPageRequest,
  GetDocumentsWithPageResponse,
  HitRequest,
  HitResponse,
  UpdateDatasetRequest,
} from '@/models/dataset.ts'
import type { BaseResponse } from '@/models/base.ts'

// 新增知识库
export const createDataset = (req: CreateDatasetRequest) => {
  return post<BaseResponse<any>>('/datasets', {
    body: req,
  })
}

// 获取知识库列表分页
export const getDatasetsWithPage = (
  current_page: number = 1,
  page_size: number = 20,
  search_word: string = '',
) => {
  return get<GetDatasetsWithPageResponse>('/datasets', {
    params: { current_page, page_size, search_word },
  })
}

// 获取知识库详情
export const getDataset = (dataset_id: string) => {
  return get<GetDatasetResponse>(`/datasets/${dataset_id}`)
}

// 更新知识库
export const updateDataset = (dataset_id: string, req: UpdateDatasetRequest) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}`, {
    body: req,
  })
}

// 删除知识库
export const deleteDataset = (dataset_id: string) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}/delete`)
}

// 获取文档列表分页
export const getDocumentsWithPage = (
  dataset_id: string,
  req: GetDocumentsWithPageRequest = {
    current_page: 1,
    page_size: 20,
    search_word: '',
  },
) => {
  return get<GetDocumentsWithPageResponse>(`/datasets/${dataset_id}/documents`, {
    params: req,
  })
}

// 获取文档详情
export const getDocument = (dataset_id: string, document_id: string) => {
  return get<GetDocumentResponse>(`/datasets/${dataset_id}/documents/${document_id}`)
}

// 更新文档启用状态
export const updateDocumentEnabled = (
  dataset_id: string,
  document_id: string,
  enabled: boolean,
) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}/documents/${document_id}/enabled`, {
    body: { enabled },
  })
}

// 删除文档
export const deleteDocument = (dataset_id: string, document_id: string) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}/documents/${document_id}/delete`)
}

// 更新文档名称
export const updateDocumentName = (dataset_id: string, document_id: string, name: string) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}/documents/${document_id}/name`, {
    body: { name },
  })
}

// 知识库召回测试
export const hit = (dataset_id: string, req: HitRequest) => {
  return post<HitResponse>(`/datasets/${dataset_id}/hit`, {
    body: req,
  })
}

// 知识库最近查询记录
export const getDatasetQueries = (dataset_id: string) => {
  return get<GetDatasetQueriesResponse>(`/datasets/${dataset_id}/queries`)
}

// 创建文档
export const createDocuments = (dataset_id: string, req: CreateDocumentRequest) => {
  return post<CreateDocumentResponse>(`/datasets/${dataset_id}/documents`, {
    body: req,
  })
}

// 获取文档处理进度
export const getDocumentsStatus = (dataset_id: string, batch: string) => {
  return get<GetDocumentsStatusResponse>(`/datasets/${dataset_id}/documents/batch/${batch}`)
}
