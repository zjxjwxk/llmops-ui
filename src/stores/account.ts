import { defineStore } from 'pinia'
import { ref } from 'vue'

// 初始数据
const initAccount = {
  name: 'Xinkang',
  email: 'zjxjwxk@gmail.com',
  avatar: '',
}

export const useAccountStore = defineStore('account', () => {
  // 定义数据
  const account = ref({ ...initAccount })

  // 定义函数
  function update(params: any) {
    Object.assign(account.value, params)
  }

  function clear() {
    account.value = { ...initAccount }
  }

  return { account, update, clear }
})
