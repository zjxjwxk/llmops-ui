import { get, post } from '@/utils/request.ts'
import type { GetCurrentUserResponse } from '@/models/account.ts'
import type { BaseResponse } from '@/models/base.ts'

// 获取当前登录账号信息
export const getCurrentUser = () => {
  return get<GetCurrentUserResponse>(`/account`)
}

// 更新当前账号密码
export const updatePassword = (password: string) => {
  return post<BaseResponse<any>>(`/account/password`, {
    body: { password },
  })
}

// 更新当前账号名称
export const updateName = (name: string) => {
  return post<BaseResponse<any>>(`/account/name`, {
    body: { name },
  })
}

// 更新当前账号头像
export const updateAvatar = (avatar: string) => {
  return post<BaseResponse<any>>(`/account/avatar`, {
    body: { avatar },
  })
}
