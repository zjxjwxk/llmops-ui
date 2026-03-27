<script setup lang="ts"></script>

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
          <div class="flex flex-row gap-2 mb-6">
            <!-- 头像 -->
            <a-avatar :style="{ background: '#3370ff' }" class="flex-shrink-0" :size="30"
              >Wu</a-avatar
            >
            <!-- 消息 -->
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">Xinkang</div>
              <div
                class="max-w-max bg-blue-700 text-white border border-blue-800 px-4 py-3 rounded-2xl leading-5"
              >
                你好，你是谁？
              </div>
            </div>
          </div>
          <!-- AI消息 -->
          <div class="flex flex-row gap-2 mb-6">
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
                你好！我是一个由Google训练的大型语言模型我的主要职责是理解并回应你的指令和问题，提供信息、生成不同类型的创意文本、进行翻译、总结内容以及协助你完成各种语言相关的任务；我没有个人身份、意识、情感或身体，也无法拥有真实的个人经历或记忆；我是一个复杂的计算机程序，通过分析和学习海量的文本和代码数据来运作，以便预测和生成连贯、相关且有用的回复；我的核心目标是尽可能地为你提供帮助，确保我的回应是有益的、准确的和无害的；我持续学习和改进，以更好地服务于各种复杂的交流需求。
              </div>
            </div>
          </div>
          <!-- AI加载状态 -->
          <div class="flex flex-row gap-2 mb-6">
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
            <a-button class="flex-shrink-0" type="text" shape="circle">
              <template #icon>
                <icon-empty size="16" :style="{ color: '#374151' }" />
              </template>
            </a-button>
            <!-- 输入框 -->
            <div
              class="h-[50px] flex items-center gap-2 px-4 flex-1 border border-gray-200 rounded-full"
            >
              <input type="text" class="flex-1 outline-0" />
              <a-button type="text" shape="circle">
                <template #icon>
                  <icon-plus-circle size="16" :style="{ color: '#374151' }" />
                </template>
              </a-button>
              <a-button type="text" shape="circle">
                <template #icon>
                  <icon-send size="16" :style="{ color: '#1d4ed8' }" />
                </template>
              </a-button>
            </div>
          </div>
          <!-- 底部提示文字 -->
          <div class="text-center text-gray-500 text-xs py-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
