<script setup lang="ts">
import { useAccountStore } from '@/stores/account'

const accountStore = useAccountStore()
</script>

<template>
  <p>AI应用列表</p>
  <p>当前登录账号：{{ accountStore.account.name }}</p>
  <router-link to="/home">返回主页</router-link>
</template>

<style scoped></style>
