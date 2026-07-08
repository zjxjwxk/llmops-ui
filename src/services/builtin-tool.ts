import { get } from '@/utils/request.ts'
import type { GetBuiltinToolsResponse, GetCategoriesResponse } from '@/models/builtin-tool.ts'

// 获取内置插件分类列表
export const getCategories = () => {
  return get<GetCategoriesResponse>('/builtin-tools/categories')
}

// 获取所有内置插件提供者列表
export const getBuiltinTools = () => {
  return get<GetBuiltinToolsResponse>('/builtin-tools')
}
