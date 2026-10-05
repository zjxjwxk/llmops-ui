<script setup lang="ts">
import Banner from './components/Banner.vue'
import LoginForm from './components/LoginForm.vue'
</script>

<template>
  <div class="flex h-screen bg-white">
    <!--顶部站点Logo-->
    <div class="fixed top-6 left-[22px] inline-flex items-center">
      <div class="bg-gray-100 h-8 leading-8 lpx-2 z-50">LLMOps AI 应用开发平台</div>
    </div>
    <!--左侧Banner-->
    <banner />
    <!--右侧表单-->
    <div class="relative flex flex-1 items-center justify-center pb-10">
      <!--登录表单-->
      <login-form />
      <!--底部Footer-->
      <div class="absolute right-0 bottom-0 w-full">
        <footer class="flex items-center justify-center h-10 text-gray-600 text-center">
          LLMOps AI 应用开发平台
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
