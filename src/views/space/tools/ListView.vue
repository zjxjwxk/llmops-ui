<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  createApiToolProvider,
  deleteApiToolProvider,
  getApiToolProvider,
  getApiToolProvidersWithPage,
  updateApiToolProvider,
  validateOpenAPISchema,
} from '@/services/api-tool.ts'
import { typeMap } from '@/config'
import moment from 'moment/moment'
import { useRoute } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'

const route = useRoute()
const props = defineProps({
  createType: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['updateCreateType'])
const providers = reactive<Array<any>>([])
const paginator = reactive({
  current_page: 1,
  page_size: 10,
  total_page: 0,
  total_record: 0,
})
const form = reactive({
  icon: 'https://picsum.photos/400',
  name: '',
  openapi_schema: '',
  headers: [],
})
const formRef = ref(null)
const shownIndex = ref<number>(-1)
const loading = ref<boolean>(false)
const showUpdateModal = ref<boolean>(false)
const showUpdateModalLoading = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const tools = computed(() => {
  try {
    const available_tools = []
    // 解析OpenAPI Schema数据
    const openapi_schema = JSON.parse(form.openapi_schema)

    // 检查是否存在paths路径
    if ('paths' in openapi_schema) {
      // 遍历所有路径并提取工具
      for (const path in openapi_schema['paths']) {
        // 遍历路径下的所有方法
        for (const method in openapi_schema['paths'][path]) {
          if (['get', 'post'].includes(method)) {
            // 提取工具信息，并检查是否存在工具名称和描述
            const tool = openapi_schema['paths'][path][method]
            if ('operationId' in tool && 'description' in tool) {
              available_tools.push({
                name: tool?.operationId,
                description: tool?.description,
                method: method,
                path: path,
              })
            }
          }
        }
      }
    }

    return available_tools
  } catch (e) {
    console.log('解析OpenAPI Schema异常')
  }
  return []
})

// 初始化分页数据
const initData = () => {
  // 初始化分页器
  paginator.current_page = 1
  paginator.page_size = 20
  paginator.total_page = 0
  paginator.total_record = 0

  // 初始化数据
  loadMoreData(true)
}

// 加载更多分页数据
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

// 根据滚动距离，加载更多分页数据
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

// 打开编辑窗口
const handleUpdate = async () => {
  try {
    // 显示编辑窗口加载中
    showUpdateModalLoading.value = true

    // 获取当前工具提供者的信息
    const provider_id = providers[shownIndex.value]['id']
    const resp = await getApiToolProvider(provider_id)
    const data = resp.data

    // 更新表单
    formRef.value.resetFields()
    form.icon = data.icon
    form.name = data.name
    form.openapi_schema = data.openapi_schema
    form.headers = data.headers
  } finally {
    showUpdateModalLoading.value = false
  }
  // 显示编辑窗口
  showUpdateModal.value = true
}

// 删除工具提供者
const handleDelete = () => {
  Modal.warning({
    title: '是否确认删除此插件？',
    content: '该操作无法撤销，AI 应用将无法使用该插件。',
    hideCancel: false,
    onOk: async () => {
      try {
        const provider_id = providers[shownIndex.value]['id']
        const resp = await deleteApiToolProvider(provider_id)
        Message.success(resp.message)
      } finally {
        // 关闭窗口和抽屉
        handleCancel()
        shownIndex.value = -1

        // 重新加载数据
        await initData()
      }
    },
  })
}

// 提交创建/编辑表单
const handleSubmit = async ({ values, errors }) => {
  if (errors) {
    return
  }
  try {
    // 按钮置为加载状态，避免重复提交
    submitLoading.value = true

    // 创建表单
    if (props.createType === 'tool') {
      const resp = await createApiToolProvider(values)
      Message.success(resp.message)
    } else if (showUpdateModal.value) {
      // 编辑表单
      const resp = await updateApiToolProvider(providers[shownIndex.value]['id'], values)
      Message.success(resp.message)
    }

    // 关闭窗口和抽屉
    handleCancel()
    shownIndex.value = -1
  } finally {
    submitLoading.value = false
  }

  // 重新加载数据
  await initData()
}

// 关闭创建/编辑窗口
const handleCancel = () => {
  // 重置表单数据
  formRef.value.resetFields()
  // 关闭创建/编辑窗口
  emits('update-create-type', '')
  showUpdateModal.value = false
}

// 加载初始化分页数据
onMounted(async () => {
  await initData()
})

// 监听路由中的搜索词
watch(
  () => route.query?.search_word,
  async () => {
    await initData()
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
        <!--编辑按钮-->
        <a-button
          :loading="showUpdateModalLoading"
          type="dashed"
          long
          class="mb-2 !rounded-lg"
          @click="handleUpdate"
        >
          <template #icon>
            <icon-settings />
          </template>
          编辑工具
        </a-button>
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
    <!--插件创建/编辑窗口-->
    <a-modal
      :width="630"
      :visible="props.createType === 'tool' || showUpdateModal"
      hide-title
      :footer="false"
      modal-class="rounded-xl"
      @cancel="handleCancel"
    >
      <!--顶部标题-->
      <div class="flex items-center justify-between">
        <div class="text-lg font-bold text-gray-700">
          {{ props.createType === 'tool' ? '新建' : '编辑' }}插件
        </div>
        <a-button type="text" class="!text-gray-700" size="small" @click="handleCancel">
          <template #icon>
            <icon-close />
          </template>
        </a-button>
      </div>
      <!--中间表单-->
      <div class="pt-6">
        <a-form ref="formRef" :model="form" @submit="handleSubmit" layout="vertical">
          <!--插件图标-->
          <a-form-item
            field="icon"
            hide-label
            :rules="[{ required: true, message: '插件图标不能为空' }]"
          >
            <a-upload
              v-model="form.icon"
              :limit="1"
              list-type="picture-card"
              accept="image/png, image/jpeg"
              class="!w-auto mx-auto"
            />
          </a-form-item>
          <!--插件名称-->
          <a-form-item
            field="name"
            label="插件名称"
            asterisk-position="end"
            :rules="[{ required: true, message: '插件名称不能为空' }]"
          >
            <a-input
              v-model="form.name"
              placeholder="请输入插件名称"
              show-word-limit
              :max-length="60"
            />
          </a-form-item>
          <!--OpenAPI Schema-->
          <a-form-item
            field="openapi_schema"
            label="OpenAPI Schema"
            asterisk-position="end"
            :rules="[{ required: true, message: 'OpenAPI Schema 不能为空' }]"
          >
            <a-textarea
              v-model="form.openapi_schema"
              :auto-size="{ minRows: 4, maxRows: 6 }"
              placeholder="请输入 OpenAPI Schema"
              @blur="
                async () => {
                  if (form.openapi_schema.trim() !== '') {
                    // 调用验证OpenAPI Schema接口
                    await validateOpenAPISchema(form.openapi_schema)
                  }
                }
              "
            />
          </a-form-item>
          <!--可用工具表格-->
          <a-form-item label="可用工具">
            <div class="rounded-lg border border-gray-200 w-full overflow-x-auto">
              <table class="w-full leading-[18px] text-xs text-gray-700 font-normal">
                <thead class="text-gray-500">
                  <tr class="border-b border-gray-200">
                    <th class="p-2 pl-3 font-medium">名称</th>
                    <th class="p-2 pl-3 font-medium w-[236px]">描述</th>
                    <th class="p-2 pl-3 font-medium">方法</th>
                    <th class="p-2 pl-3 font-medium">路径</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(tool, idx) in tools"
                    :key="idx"
                    class="border-b last:border-0 border-gray-200 text-gray-700"
                  >
                    <td class="p-2 pl-3">{{ tool.name }}</td>
                    <td class="p-2 pl-3 w-[236px]">{{ tool.description }}</td>
                    <td class="p-2 pl-3">{{ tool.method }}</td>
                    <td class="p-2 pl-3 w-[64px]">{{ tool.path }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </a-form-item>
          <!--请求头表格-->
          <a-form-item label="Headers">
            <div class="rounded-lg border border-gray-200 w-full overflow-x-auto">
              <table class="w-full leading-[18px] text-xs text-gray-700 font-normal mb-3">
                <thead class="text-gray-500">
                  <tr class="border-b border-gray-200">
                    <th class="p-2 pl-3 font-medium">Key</th>
                    <th class="p-2 pl-3 font-medium">Value</th>
                    <th class="p-2 pl-3 font-medium w-[50px]">操作</th>
                  </tr>
                </thead>
                <tbody v-if="form.headers.length > 0" class="border-b border-gray-200">
                  <tr
                    v-for="(header, idx) in form.headers"
                    :key="idx"
                    class="border-b last:border-0 border-gray-200"
                  >
                    <td class="p-2 pl-3">
                      <a-form-item :field="`headers[${idx}].key`" hide-label class="!m-0">
                        <a-input v-model="header.key" placeholder="请输入请求头的键名" />
                      </a-form-item>
                    </td>
                    <td class="p-2 pl-3">
                      <a-form-item :field="`headers[${idx}].value`" hide-label class="!m-0">
                        <a-input v-model="header.value" placeholder="请输入请求头的键值" />
                      </a-form-item>
                    </td>
                    <td class="p-2 pl-3">
                      <a-button
                        size="mini"
                        type="text"
                        class="!text-gray-700"
                        @click="form.headers.splice(idx, 1)"
                      >
                        <template #icon>
                          <icon-delete />
                        </template>
                      </a-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <a-button
                size="mini"
                class="!rounded !ml-3 !mb-3 !text-gray-700"
                @click="form.headers.push({ key: '', value: '' })"
              >
                <template #icon>
                  <icon-plus />
                </template>
                添加参数
              </a-button>
            </div>
          </a-form-item>
          <!--底部按钮-->
          <div class="flex items-center justify-between">
            <div class="">
              <a-button
                v-if="showUpdateModal"
                class="!rounded-lg !text-red-700"
                @click="handleDelete"
                >删除</a-button
              >
            </div>
            <a-space :size="16">
              <a-button class="!rounded-lg" @click="handleCancel">取消</a-button>
              <a-button :loading="submitLoading" type="primary" html-type="submit" class="!rounded-lg">保存</a-button>
            </a-space>
          </div>
        </a-form>
      </div>
    </a-modal>
  </a-spin>
</template>

<style scoped></style>
