<script setup lang="ts">
import { onMounted } from 'vue'
import { authorize } from '@/services/oauth.ts'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useCredentialState } from '@/stores/credential.ts'

const route = useRoute()
const router = useRouter()
const credentialStore = useCredentialState()

onMounted(async () => {
  try {
    // 调用第三方OAuth登录接口
    const resp = await authorize(route.params?.provider_name as string, route.query?.code as string)

    // 登录成功 => 更新Local Storage，并跳转Home页面
    Message.success('登录成功，正在跳转页面')
    credentialStore.update(resp.data)
    await router.replace({ path: '/home' })
  } catch (error) {
    // 登录失败 => 重定向到登录页面
    await router.replace({ path: '/auth/login' })
  }
})
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-white">
    <a-spin tip="第三方授权登录中"></a-spin>
  </div>
</template>

<style scoped></style>
