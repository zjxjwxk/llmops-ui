import { upload } from '@/utils/request.ts'
import type { UploadImageResponse } from '@/models/upload-file.ts'

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
