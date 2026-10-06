<script setup lang="ts">
import SideBar from '@/views/layouts/components/SideBar.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCredentialStore } from '@/stores/credential.ts'
import { useAccountStore } from '@/stores/account.ts'
import { logout } from '@/services/auth.ts'
import { getCurrentUser } from '@/services/account.ts'
import SettingModal from '@/views/layouts/components/SettingModal.vue'

const settingModalVisible = ref(false)
const router = useRouter()
const credentialStore = useCredentialStore()
const accountStore = useAccountStore()

// 处理退出登录
const handleLogout = async () => {
  // 发起请求退出登录
  await logout()

  // 清空凭证+账号信息
  credentialStore.clear()
  accountStore.clear()

  // 跳转到登录页面
  await router.replace({ name: 'auth-login' })
}

// 页面DOM加载完成时获取当前登录账号信息
onMounted(async () => {
  const resp = await getCurrentUser()
  accountStore.update(resp.data)
})
</script>

<template>
  <a-layout has-sider class="h-full">
    <!--侧边栏-->
    <a-layout-sider :width="240" class="min-h-screen bg-gray-50 p-2 shadow-none">
      <div class="bg-white h-full rounded-lg px-2 py-4 flex flex-col justify-between">
        <!--上半部分-->
        <div class="">
          <!--顶部Logo-->
          <router-link
            to="/home"
            class="block h-9 w-[110px] mb-5 !bg-gray-200 hover:bg-gray-300 transition-all rounded-lg"
          />
          <!--创建AI应用按钮-->
          <a-button type="primary" long class="!rounded-lg mb-4">
            <template #icon>
              <icon-plus />
            </template>
            创建AI应用
          </a-button>
          <!--侧边栏导航-->
          <side-bar />
        </div>
        <!--账号设置-->
        <a-dropdown position="tl">
          <div
            class="flex items-center p-2 gap-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100"
          >
            <!--头像-->
            <a-avatar
              :size="32"
              class="!text-sm !bg-blue-700"
              :image-url="accountStore.account.avatar"
              >Wu</a-avatar
            >
            <!--个人信息-->
            <div class="flex flex-col">
              <div class="text-sm text-gray-900">{{ accountStore.account.name }}</div>
              <div class="text-xs text-gray-500">{{ accountStore.account.email }}</div>
            </div>
          </div>
          <template #content>
            <a-doption @click="settingModalVisible = true">
              <template #icon>
                <icon-settings />
              </template>
              账号设置
            </a-doption>
            <a-doption @click="handleLogout">
              <template #icon>
                <icon-poweroff />
              </template>
              退出登陆
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </a-layout-sider>
    <!--右侧内容-->
    <a-layout-content>
      <router-view />
    </a-layout-content>
    <!-- 设置模态窗 -->
    <setting-modal v-model:visible="settingModalVisible" />
  </a-layout>
</template>

<style scoped></style>
