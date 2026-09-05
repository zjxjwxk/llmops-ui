import { get, post } from '@/utils/request.ts'
import type {
  CreateDatasetRequest,
  GetDatasetResponse,
  GetDatasetsWithPageResponse,
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
export const updateDataset = (dataset_id: string, req: CreateDatasetRequest) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}`, {
    body: req,
  })
}

// 删除知识库
export const deleteDataset = (dataset_id: string) => {
  return post<BaseResponse<any>>(`/datasets/${dataset_id}/delete`)
}
