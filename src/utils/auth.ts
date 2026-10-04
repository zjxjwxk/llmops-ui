import storage from '@/utils/storage.ts'

export default {
  isLogin: (): boolean => {
    // 从Local Storage获取Access Token
    const credential = storage.get('credential')

    // 判断Access Token是否存在，并判断是否过期
    const now = Math.floor(Date.now() / 1000)
    if (
      !credential ||
      !credential.access_token ||
      !credential.expire_at ||
      credential.expire_at < now
    ) {
      // 账号未登录或已过期 => 移除Local Storage中的数据
      storage.clear()
      return false
    }
    return true
  },
}
