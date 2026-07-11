import { get } from '@/utils/request.ts'
import type { GetApiToolProvidersWithPageResponse } from '@/models/api-tool.ts'

// 获取自定义API工具提供商分页
export const getApiToolProvidersWithPage = (
  current_page: number = 1,
  page_size: number = 20,
  search_word: string = '',
) => {
  return get<GetApiToolProvidersWithPageResponse>('/api-tools', {
    params: { current_page, page_size, search_word },
  })
}
