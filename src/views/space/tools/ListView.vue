<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { getApiToolProvidersWithPage } from '@/services/api-tool.ts'
import { typeMap } from '@/config'
import moment from 'moment/moment'
import { useRoute } from 'vue-router'

const route = useRoute()
const providers = reactive<Array<any>>([])
const paginator = reactive({
  current_page: 1,
  page_size: 10,
  total_page: 0,
  total_record: 0,
})
const shownIndex = ref<number>(-1)
const loading = ref<boolean>(false)

const loadMoreData = async (init: boolean = false) => {
  // 检查是否需要加载更多分页数据
  if (!init && paginator.current_page > paginator.total_page) {
    return
  }

  try {
    loading.value = true
    // 获取分页数据
    const resp = await getApiToolProvidersWithPage(
      paginator.current_page,
      paginator.page_size,
      String(route.query?.search_word ?? ''),
    )
    const data = resp.data

    // 更新分页信息
    paginator.current_page = data.paginator.current_page
    paginator.page_size = data.paginator.page_size
    paginator.total_page = data.paginator.total_page
    paginator.total_record = data.paginator.total_record

    // 更新当前页为下一页
    if (paginator.current_page <= paginator.total_page) {
      paginator.current_page += 1
    }

    // 初始化或增加提供商数据
    if (init) {
      providers.splice(0, providers.length, ...data.list)
    } else {
      providers.push(...data.list)
    }
  } finally {
    loading.value = false
  }
}

const handleScroll = (event: UIEvent) => {
  // 获取滚动距离、可滚动的最大距离、客户端/浏览器窗口的高度
  const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement

  // 判断是否滚动到底部
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (loading.value) {
      return
    }
    loadMoreData()
  }
}

onMounted(async () => {
  await loadMoreData(true)
})

// 监听路由中的搜索词
watch(
  () => route.query?.search_word,
  () => {
    // 初始化分页器
    paginator.current_page = 1
    paginator.page_size = 20
    paginator.total_page = 0
    paginator.total_record = 0

    // 根据搜索词初始化数据
    loadMoreData(true)
  },
)
</script>

<template>
  <a-spin
    :loading="loading"
    class="block h-full w-hull scrollbar-w-none overflow-scroll"
    @scroll="handleScroll"
  >
    <!--底部插件列表-->
    <a-row :gutter="[20, 20]" class="flex-1">
      <!--有数据的UI状态-->
      <a-col v-for="(provider, index) in providers" :key="provider.name" :span="6">
        <a-card hoverable class="cursor-pointer rounded-lg" @click="shownIndex = index">
          <!--顶部提供商名称-->
          <div class="flex items-center gap-3 mb-3">
            <!--左侧图标-->
            <a-avatar
              :size="40"
              shape="square"
              :image-url="provider.icon"
              :style="{ backgroundColor: '#FFFFFF' }"
            />
            <!--右侧工具信息-->
            <div class="flex flex-col">
              <div class="text-base text-gray-900 fount-bold">{{ provider.name }}</div>
              <div class="text-xs text-gray-500 line-clamp-1">
                提供商 {{ provider.name }} - {{ provider.tools.length }} 个插件
              </div>
            </div>
          </div>
          <!--提供商描述信息-->
          <div class="leading-[18px] text-gray-500 h-[72px] line-clamp-4 mb-2">
            {{ provider.description }}
          </div>
          <!--提供商发布信息-->
          <div class="flex items-center gap-1.5">
            <a-avatar :size="18" class="!bg-blue-700">
              <icon-user />
            </a-avatar>
            <div class="text-xs text-gray-400">
              Xinkang 编辑时间:
              {{ moment(provider.created_at * 1000).format('YYYY-MM-DD HH:mm') }}
            </div>
          </div>
        </a-card>
      </a-col>
      <!--无数据的UI状态-->
      <a-col v-if="providers.length === 0" :span="24">
        <a-empty
          description="没有可用的API插件"
          class="h-[400px] flex flex-col items-center justify-center"
        />
      </a-col>
    </a-row>
    <!--加载器-->
    <a-row v-if="providers.length > 0">
      <!--加载数据中-->
      <a-col v-if="paginator.current_page <= paginator.total_page" :span="24" align="center">
        <a-space class="my-4">
          <a-spin />
          <div class="text-gray-400">加载中</div>
        </a-space>
      </a-col>
      <!--数据加载完成-->
      <a-col v-else :span="24" align="center">
        <div class="text-gray-400 my-4">数据已加载完成</div>
      </a-col>
    </a-row>
    <!--插件卡片抽屉-->
    <a-drawer
      :visible="shownIndex != -1"
      :width="350"
      :footer="false"
      title="工具详情"
      :drawer-style="{ background: '#F9FAFB' }"
      @cancel="shownIndex = -1"
    >
      <!--外部容器，当shownIndex为-1时，不显示卡片抽屉-->
      <div v-if="shownIndex != -1" class="">
        <!--顶部提供商名称-->
        <div class="flex items-center gap-3 mb-3">
          <!--左侧图标-->
          <a-avatar
            :size="40"
            shape="square"
            :image-url="providers[shownIndex].icon"
            :style="{ backgroundColor: '#FFFFFF' }"
          />
          <!--右侧工具信息-->
          <div class="flex flex-col">
            <div class="text-base text-gray-900 fount-bold">
              {{ providers[shownIndex].name }}
            </div>
            <div class="text-xs text-gray-500 line-clamp-1">
              提供商 {{ providers[shownIndex].name }} -
              {{ providers[shownIndex].tools.length }} 个插件
            </div>
          </div>
        </div>
        <!--提供商描述信息-->
        <div class="leading-[18px] text-gray-500 mb-2">
          {{ providers[shownIndex].description }}
        </div>
        <!--分割符-->
        <hr class="my-4 border-gray-300" />
        <!--提供商工具列表-->
        <div class="flex flex-col gap-2">
          <div class="text-xs text-gray-500">
            包含 {{ providers[shownIndex].tools.length }} 个工具
          </div>
          <!--工具列表-->
          <a-card
            v-for="tool in providers[shownIndex].tools"
            :key="tool.name"
            class="cursor-pointer flex flex-col rounded-xl"
          >
            <!--工具名称-->
            <div class="font-bold text-gray-900 mb-2">{{ tool.name }}</div>
            <!--工具描述-->
            <div class="text-gray-500 text-xs">{{ tool.description }}</div>
            <!--工具参数-->
            <div v-if="tool.inputs.length > 0" class="">
              <!--分割符-->
              <div class="flex items-center gap-2 my-4">
                <div class="text-xs font-bold text-gray-500">参数</div>
                <hr class="flex-1 border-gray-300" />
              </div>
              <!--参数列表-->
              <div class="flex flex-col gap-4">
                <div v-for="input in tool.inputs" :key="input.name" class="flex flex-col gap-2">
                  <!--上半部分：参数名称/类型/是否必填-->
                  <div class="flex items-center gap-2 text-xs">
                    <div class="text-gray-900 font-bold">{{ input.name }}</div>
                    <div class="text-gray-500">{{ typeMap[input.type] }}</div>
                    <div v-if="input.required" class="text-red-700">必填</div>
                  </div>
                  <!--下半部分：参数描述-->
                  <div class="text-xs text-gray-500">{{ input.description }}</div>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </a-drawer>
  </a-spin>
</template>

<style scoped></style>
