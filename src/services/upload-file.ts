import { upload } from '@/utils/request.ts'
import type { UploadFileResponse, UploadImageResponse } from '@/models/upload-file.ts'

// 上传图片
export const uploadImage = (image: File) => {
  // 构建表单并添加图片
  const formData = new FormData()
  formData.append('file', image)

  // 调用上传文件接口
  return upload<UploadImageResponse>(`/upload-files/image`, {
    data: formData,
  })
}

// 上传文件
export const uploadFile = (file: File) => {
  // 构建表单并添加图片
  const formData = new FormData()
  formData.append('file', file)

  // 调用上传文件接口
  return upload<UploadFileResponse>(`/upload-files/file`, {
    data: formData,
  })
}
