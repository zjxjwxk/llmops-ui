<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCredentialState } from '@/stores/credential.ts'
import { useRouter } from 'vue-router'
import { Message, ValidatedError } from '@arco-design/web-vue'
import { provider } from '@/services/oauth.ts'
import { passwordLogin } from '@/services/auth.ts'

const errorMessage = ref('')
const passwordLoading = ref(false)
const githubLoading = ref(false)
const loginForm = reactive({ email: '', password: '' })
const credentialStore = useCredentialState()
const router = useRouter()

// 忘记密码点击事件
const forgetPassword = () => Message.error('忘记密码请联系管理员')

// GitHub第三方OAuth登录
const githubLogin = async () => {
  try {
    // 获取GitHub OAuth登录地址
    githubLoading.value = true
    const resp = await provider('github')
    window.location.href = resp.data.redirect_url
  } finally {
    githubLoading.value = false
  }
}

// 账号密码登录
const handleSubmit = async ({ errors }: { errors: Record<string, ValidatedError> | undefined }) => {
  // 判断表单是否校验成功
  if (errors) {
    return
  }

  try {
    // 发起登录请求
    passwordLoading.value = true
    const resp = await passwordLogin(loginForm.email, loginForm.password)

    // 登录成功 => 更新Local Storage，并跳转Home页面
    Message.success('登录成功，正在跳转页面')
    credentialStore.update(resp.data)
    await router.replace({ path: '/home' })
  } catch (error: any) {
    // 登录失败 => 提示错误消息，并清空密码
    errorMessage.value = error.message
    loginForm.password = ''
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <div>
    <!--顶部标题-->
    <div class="text-gray-900 font-bold text-2xl leading-0 mb-4">LLMOps AI 应用开发平台</div>
    <p class="text-base leading-6 text-gray-600">高效开发你的 AI 原生应用</p>
    <!--错误提示占位符-->
    <div class="h-8 text-red-700 leading-8 line-clamp-1">{{ errorMessage }}</div>
    <!--登录表单-->
    <a-form
      :model="loginForm"
      @submit="handleSubmit"
      layout="vertical"
      size="large"
      class="flex flex-col w-full"
    >
      <a-form-item
        field="email"
        :rules="[{ type: 'email', required: true, message: '登录账号必须为合法邮箱地址' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model:model-value="loginForm.email" size="large" placeholder="登录账号">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: '账号密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model:model-value="loginForm.password"
          size="large"
          placeholder="账号密码"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="flex justify-between">
          <a-checkbox>记住密码</a-checkbox>
          <a-link @click="forgetPassword">忘记密码?</a-link>
        </div>
        <a-button :loading="passwordLoading" size="large" type="primary" html-type="submit" long
          >登录</a-button
        >
        <a-divider>第三方授权登录</a-divider>
        <a-button :loading="githubLoading" size="large" type="dashed" long @click="githubLogin">
          <template #icon>
            <icon-github />
          </template>
          GitHub
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<style scoped></style>
