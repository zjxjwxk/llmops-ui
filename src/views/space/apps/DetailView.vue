<script setup lang="ts">
import { post } from '@/utils/request.ts'

async function debug() {
  const response = await post('/apps/66d2fc17-a0bb-4401-9161-28b2d4151871/debug', {
    body: { query: '你好，你是谁？' },
  })
  console.log(response)
}
</script>

<template>
  <a-button @click="debug">发起请求</a-button>
</template>

<style scoped></style>
