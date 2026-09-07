import type { BaseResponse } from '@/models/base.ts'

// 上传图片响应
export type UploadImageResponse = BaseResponse<{
  image_url: string
}>

// 上传文件响应
export type UploadFileResponse = BaseResponse<{
  id: string
  account_id: string
  name: string
  key: string
  size: number
  extension: string
  mime_type: string
  created_at: number
}>
