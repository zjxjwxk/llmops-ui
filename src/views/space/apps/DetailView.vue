<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { post } from '@/utils/request.ts'

// 定义交互所需数据
const query = ref('')
const messages = ref([] as { role: string; content: string }[])
const isLoading = ref(false)

// 消息清除方法
const clearMessages = () => {
  messages.value = []
}

// 消息发送方法
const send = async () => {
  // 获取用户输入的消息，并校验是否为空
  const humanQuery = query.value
  if (!humanQuery) {
    Message.error('输入消息不能为空')
    return
  }

  // 上一条消息还在处理中，不允许发送新的请求
  if (isLoading.value) {
    Message.warning('上一条消息还在处理中，请稍等')
    return
  }

  // 发送用户输入的消息
  messages.value.push({
    role: 'human',
    content: humanQuery,
  })

  // 清空输入框
  query.value = ''

  // 设置加载状态
  isLoading.value = true

  // 发起API请求
  const response = await post('/apps/66d2fc17-a0bb-4401-9161-28b2d4151871/debug', {
    body: { query: humanQuery },
  })
  const aiMessage = response.data.content

  // 将AI返回的消息加入消息数组
  messages.value.push({
    role: 'ai',
    content: aiMessage,
  })

  // 清除加载状态
  isLoading.value = false
}
</script>

<template>
  <!-- 最外层容器，高度撑满整个浏览器屏幕 -->
  <div class="min-h-screen">
    <!-- 顶部导航 -->
    <header class="flex items-center h-[74px] bg-gray-100 border-b border-gray-200 px-4">
      顶部导航
    </header>
    <!-- 底部内容区 -->
    <div class="flex flex-row h-[calc(100vh-74px)]">
      <!-- 左侧2/3-应用编排 -->
      <div class="w-2/3 bg-gray-50 h-full">
        <header class="flex items-center h-16 border-b border-gray-200 px-7 text-xl text-gray-700">
          应用编排
        </header>
        <div class="flex flex-row h-[calc(100%-64px)]">
          <div class="flex-1 border-r border-gray-200 p-6">人设与回复逻辑</div>
          <div class="flex-1 p-6">应用能力</div>
        </div>
      </div>
      <!-- 右侧1/3-预览与调试 -->
      <div class="w-1/3 flex flex-col bg-white h-full">
        <header
          class="flex flex-shrink-0 items-center h-16 px-4 text-xl bg-white border-b border-gray-200 shadow-sm"
        >
          预览与调试
        </header>
        <!-- 调试对话界面 -->
        <div class="h-full min-h-0 px-6 py-7 overflow-x-hidden overflow-y-scroll scrollbar-w-none">
          <!-- 人类消息 -->
          <div class="flex flex-row gap-2 mb-6" v-for="message in messages" :key="message.content">
            <!-- 人类头像 -->
            <a-avatar
              v-if="message.role === 'human'"
              :style="{ background: '#3370ff' }"
              class="flex-shrink-0"
              :size="30"
              >Wu</a-avatar
            >
            <!-- AI头像 -->
            <a-avatar v-else :style="{ background: '#00d0b6' }" class="flex-shrink-0" :size="30">
              <icon-apps />
            </a-avatar>
            <!-- 发送方和消息框 -->
            <div class="flex flex-col gap-2">
              <!-- 发送方名称 -->
              <div class="font-semibold text-gray-700">
                {{ message.role === 'human' ? 'Xinkang' : 'AI应用' }}
              </div>
              <!-- 人类消息框 -->
              <div
                v-if="message.role === 'human'"
                class="max-w-max bg-blue-700 text-white border border-blue-800 px-4 py-3 rounded-2xl leading-5"
              >
                {{ message.content }}
              </div>
              <!-- AI消息框 -->
              <div
                v-else
                class="max-w-max bg-gray-100 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl leading-5"
              >
                {{ message.content }}
              </div>
            </div>
          </div>
          <!-- 消息为空时，默认展示应用icon和名称 -->
          <div
            v-if="!messages.length"
            class="mt-[200px] flex flex-col items-center justify-center gap-2"
          >
            <a-avatar :size="70" shape="square" :style="{ background: '#00d0b6' }">
              <icon-apps />
            </a-avatar>
            <div class="text-2xl font-semibold text-gray-900">AI 应用</div>
          </div>
          <!-- AI加载状态 -->
          <div v-if="isLoading" class="flex flex-row gap-2 mb-6">
            <!-- 头像 -->
            <a-avatar :style="{ background: '#00d0b6' }" class="flex-shrink-0" :size="30">
              <icon-apps />
            </a-avatar>
            <!-- 消息 -->
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">AI应用</div>
              <div
                class="max-w-max bg-gray-100 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl leading-5"
              >
                <icon-loading />
              </div>
            </div>
          </div>
        </div>
        <!-- 调试对话输入框 -->
        <div class="w-full flex-shrink-0 flex flex-col">
          <!-- 顶部输入框 -->
          <div class="px-6 flex items-center gap-4">
            <!-- 清除按钮 -->
            <a-button class="flex-shrink-0" type="text" shape="circle" @click="clearMessages">
              <template #icon>
                <icon-empty size="16" :style="{ color: '#374151' }" />
              </template>
            </a-button>
            <!-- 输入框组件 -->
            <div
              class="h-[50px] flex items-center gap-2 px-4 flex-1 border border-gray-200 rounded-full"
            >
              <!-- 输入框 -->
              <input type="text" class="flex-1 outline-0" v-model="query" @keyup.enter="send" />
              <!-- 上传文件按钮 -->
              <a-button type="text" shape="circle">
                <template #icon>
                  <icon-plus-circle size="16" :style="{ color: '#374151' }" />
                </template>
              </a-button>
              <!-- 消息发送按钮 -->
              <a-button type="text" shape="circle" @click="send">
                <template #icon>
                  <icon-send size="16" :style="{ color: '#1d4ed8' }" />
                </template>
              </a-button>
            </div>
          </div>
          <!-- 底部提示文字 -->
          <div class="text-center text-gray-500 text-xs py-4">
            内容由AI生成，无法确保真实准确，仅供参考。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
