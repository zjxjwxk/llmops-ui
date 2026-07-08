import { type BaseResponse } from '@/models/base.ts' // 获取内置插件分类响应

// 获取内置插件分类列表响应
export type GetCategoriesResponse = BaseResponse<
  Array<{
    category: string
    icon: string
    name: string
  }>
>

// 获取所有内置插件提供者列表
export type GetBuiltinToolsResponse = BaseResponse<
  Array<{
    background: string
    category: string
    created_at: number
    description: string
    label: string
    name: string
    tools: Array<never>
  }>
>
