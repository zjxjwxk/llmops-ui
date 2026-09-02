import { get } from '@/utils/request.ts'
import type { GetDatasetsWithPageResp } from '@/models/dataset.ts'

// 获取知识库列表分页
export const getDatasetsWithPage = (
  current_page: number = 1,
  page_size: number = 20,
  search_word: string = '',
) => {
  return get<GetDatasetsWithPageResp>('/datasets', {
    params: { current_page, page_size, search_word },
  })
}
