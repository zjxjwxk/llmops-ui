<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { debugApp } from '@/services/app.ts'
import { useRoute } from 'vue-router'

// 渲染Markdown并过滤危险内容，防止XSS攻击
const renderMarkdown = (content: string) => {
  return DOMPurify.sanitize(marked.parse(content) as string)
}

// 定义交互所需数据
const route = useRoute()
const query = ref('')
const messages = ref([] as { role: string; content: string }[])
const isLoading = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// 根据内容自动调整输入框高度（最高120px，超出后内部滚动）
const resizeInput = () => {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

// 输入内容变化时，重新计算输入框高度
watch(query, () => nextTick(resizeInput))

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  const el = scrollContainer.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

// 消息新增或流式内容更新时，自动滚动到底部
watch(messages, scrollToBottom, { deep: true })

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

  try {
    // 将用户消息加入消息数组
    messages.value.push({
      role: 'human',
      content: humanQuery,
    })

    // 清空输入框
    query.value = ''

    // 设置加载状态
    isLoading.value = true

    messages.value.push({
      role: 'ai',
      content: '',
    })

    await debugApp(route.params.app_id as string, humanQuery, (event_response) => {
      // 提取流式事件响应数据
      const event = event_response?.event
      const data = event_response?.data

      // 获取最后一条消息
      const lastIndex = messages.value.length - 1
      const message = messages.value[lastIndex]

      // TODO: 目前仅处理agent_message事件
      if (event === 'agent_message') {
        const chunk_content = data?.answer
        messages.value[lastIndex].content = message.content + chunk_content
      }
    })
  } finally {
    // 清除加载状态
    isLoading.value = false
  }
}

// 回车发送消息，Shift+回车换行，输入法组合输入期间不发送
const handleEnter = (event: KeyboardEvent) => {
  // 输入法组合输入（如中文候选词确认）期间交给输入法处理
  if (event.isComposing || event.keyCode === 229) {
    return
  }
  // Shift+回车插入换行
  if (event.shiftKey) {
    return
  }
  // 阻止默认换行并发送消息
  event.preventDefault()
  send()
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
        <div
          ref="scrollContainer"
          class="h-full min-h-0 px-6 py-7 overflow-x-hidden overflow-y-scroll scrollbar-w-none"
        >
          <!-- 人类消息 -->
          <div class="flex flex-row gap-2 mb-6" v-for="(message, index) in messages" :key="index">
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
                class="max-w-max bg-blue-700 text-white border border-blue-800 px-4 py-3 rounded-2xl leading-5 whitespace-pre-wrap break-words"
              >
                {{ message.content }}
              </div>
              <!-- AI消息框 -->
              <div
                v-else
                class="max-w-max bg-gray-100 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl leading-5"
              >
                <div
                  class="prose prose-sm max-w-none markdown-body"
                  :class="{
                    'markdown-streaming': isLoading && index === messages.length - 1,
                  }"
                  v-html="renderMarkdown(message.content)"
                ></div>
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
        </div>
        <!-- 调试对话输入框 -->
        <div class="w-full flex-shrink-0 flex flex-col">
          <!-- 顶部输入框 -->
          <div class="px-6 pt-4 flex items-center gap-4">
            <!-- 清除按钮 -->
            <a-button class="flex-shrink-0" type="text" shape="circle" @click="clearMessages">
              <template #icon>
                <icon-empty size="16" :style="{ color: '#374151' }" />
              </template>
            </a-button>
            <!-- 输入框组件 -->
            <div
              class="min-h-[50px] py-3 flex items-center gap-2 px-4 flex-1 border border-gray-200 rounded-3xl shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
            >
              <!-- 输入框 -->
              <textarea
                ref="inputRef"
                rows="1"
                class="flex-1 resize-none outline-0 bg-transparent p-0 leading-6 max-h-[120px] overflow-y-auto scrollbar-w-none"
                v-model="query"
                @keydown.enter="handleEnter"
              ></textarea>
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

<style>
/* 缩小Markdown分割线（<hr>）的上下间距 */
.markdown-body hr {
  margin-top: 1em;
  margin-bottom: 1em;
}

/* 流式输出时，在Markdown内容的末尾追加闪烁光标 */
.markdown-streaming:empty::after,
.markdown-streaming > :last-child::after {
  content: '';
  display: inline-block;
  width: 1px;
  height: 14px;
  margin-left: 2px;
  background-color: #444444;
  animation: blink 1s step-end infinite;
  vertical-align: middle;
}

/* 闪烁动画 */
@keyframes blink {
  0%,
  100% {
    opacity: 1; /* 显示 */
  }
  50% {
    opacity: 0; /* 隐藏 */
  }
}
</style>
