<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onUnmounted, reactive, ref } from 'vue'
import { type Form, Message } from '@arco-design/web-vue'
import { unescapeString } from '@/utils/helper.ts'
import { createDocuments, getDocumentsStatus } from '@/services/dataset.ts'
import { uploadFile } from '@/services/upload-file.ts'

let timer = null
let batch = ''
let fetchCount = 0
const route = useRoute()
const currentStep = ref(1)
const createDocumentsForm = reactive({
  file_list: [],
  process_type: 'automatic',
  rule: {
    separators: ['\\n'],
    chunk_size: 500,
    chunk_overlap: 50,
    pre_process_rules: [],
  },
})
const customRuleFormRef = ref<InstanceType<typeof Form>>()
const createDocumentsLoading = ref(false)
const documents = reactive<Array<any>>([])

// 进入下一步
const nextStep = async () => {
  // 第一步
  if (currentStep.value === 1) {
    if (createDocumentsForm.file_list.length === 0) {
      Message.error('请上传需要添加的文档')
      return
    }
    const isUploaded = createDocumentsForm.file_list.every((file) => file?.response?.data?.id)
    if (!isUploaded) {
      Message.warning('请等候文档上传完毕')
      return
    }
    currentStep.value++
  } else if (currentStep.value === 2) {
    // 第二步

    // 若处理类型为自定义，则需要校验表单数据
    if (createDocumentsForm.process_type === 'custom') {
      const errors = await customRuleFormRef.value?.validate()
      if (errors) {
        return
      }
    }

    try {
      createDocumentsLoading.value = true
      const req = {
        upload_file_ids: createDocumentsForm.file_list.map((file) => file?.response?.data?.id),
        process_type: createDocumentsForm.process_type,
      }

      // 若处理类型为自定义，则需要添加自定义规则
      if (createDocumentsForm.process_type === 'custom') {
        req.rule = {
          pre_process_rules: [
            {
              id: 'remove_extra_space',
              enabled: createDocumentsForm.rule.pre_process_rules.includes('remove_extra_space'),
            },
            {
              id: 'remove_url_and_email',
              enabled: createDocumentsForm.rule.pre_process_rules.includes('remove_url_and_email'),
            },
          ],
          segment: {
            separators: createDocumentsForm.rule.separators.map((separator) =>
              unescapeString(separator),
            ),
            chunk_size: createDocumentsForm.rule.chunk_size,
            chunk_overlap: createDocumentsForm.rule.chunk_overlap,
          },
        }
      }

      // 发起请求
      const resp = await createDocuments(route.params?.dataset_id as string, req)
      batch = resp.data.batch

      // 获取文档处理进度，并开始定时请求
      await fetchDocumentsStatus()
      startTimer()

      // 创建文档预处理成功后，进入下一步
      currentStep.value++
    } finally {
      createDocumentsLoading.value = false
    }
  }
}

// 获取文档处理进度
const fetchDocumentsStatus = async () => {
  fetchCount++
  const resp = await getDocumentsStatus(route.params?.dataset_id as string, batch)
  const data = resp.data

  // 更新文档处理进度
  documents.splice(0, documents.length, ...data)

  // 请求次数超过限制，则停止定时请求
  if (fetchCount >= 30) {
    stopTimer()
  }

  // 文档全部处理完成，则停止定时请求
  const isCompleted = data.every(
    (document) => document.status === 'completed' || document.status === 'error',
  )
  if (isCompleted) {
    stopTimer()
  }
}

// 开始定时请求
const startTimer = () => (timer = setInterval(fetchDocumentsStatus, 5000))

// 停止定时请求
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 页面卸载时，停止定时请求
onUnmounted(() => stopTimer())
</script>

<template>
  <div class="p-6">
    <!--回退按钮与标题-->
    <div class="flex items-center mb-6 gap-4">
      <!--左侧回退按钮-->
      <router-link
        :to="{
          name: 'space-datasets-documents-list',
          params: { dataset_id: route.params?.dataset_id as string },
        }"
      >
        <a-button size="small" type="text" class="!text-gray-700">
          <template #icon>
            <icon-left />
          </template>
        </a-button>
      </router-link>
      <div class="text-lg font-bold text-gray-700">添加文档</div>
    </div>
    <!--步骤条-->
    <div class="w-[520px] mx-auto">
      <a-steps :current="currentStep">
        <a-step>上传</a-step>
        <a-step>分段设置</a-step>
        <a-step>数据处理</a-step>
      </a-steps>
    </div>
    <!--步骤页面-->
    <div class="min-h-[calc(100vh-160px)] p-[48px]">
      <!--上传页面-->
      <div v-if="currentStep === 1">
        <!--上传文件按钮-->
        <a-upload
          v-model:file-list="createDocumentsForm.file_list"
          draggable
          accept=".doc,.docx,.pdf,.txt,.md,.markdown"
          :limit="10"
          multiple
          tip="支持DOC、DOCX、PDF、TXT、MD格式文件，最多可上传10个文件，每个文件大小不超过10MB"
          :custom-request="
            async (option) => {
              // 提取文件和成功回调
              const { fileItem, onSuccess } = option

              // 调用服务上传文件
              const resp = await uploadFile(fileItem.file)
              onSuccess(resp)
            }
          "
        />
      </div>
      <!--分段设置页面-->
      <div v-if="currentStep === 2">
        <!--自动分段与清洗-->
        <div
          :class="`px-5 py-4 bg-white rounded-lg border cursor-pointer mb-4 border-gray-200 hover:border-blue-700 ${createDocumentsForm.process_type === 'automatic' ? '!border-blue-700' : ''}`"
          @click="createDocumentsForm.process_type = 'automatic'"
        >
          <div class="font-bold text-gray-700 mb-2">自动分段与清洗</div>
          <div class="text-gray-500">自动分段与预处理规则</div>
        </div>
        <!--自定义-->
        <div
          :class="`px-5 py-4 bg-white rounded-lg border cursor-pointer mb-4 border-gray-200 hover:border-blue-700 ${createDocumentsForm.process_type === 'custom' ? '!border-blue-700' : ''}`"
          @click="createDocumentsForm.process_type = 'custom'"
        >
          <div class="font-bold text-gray-700 mb-2">自定义</div>
          <div class="text-gray-500">自定义分段与预处理规则</div>
          <!--自定义表单-->
          <div v-if="createDocumentsForm.process_type === 'custom'" class="">
            <a-divider />
            <!--表单选项-->
            <a-form :model="createDocumentsForm.rule" ref="customRuleFormRef" layout="vertical">
              <a-form-item
                field="separators"
                label="分段标识符"
                asterisk-position="end"
                :rules="[{ required: true, message: '分段标识符不能为空' }]"
              >
                <a-input-tag
                  v-model:model-value="createDocumentsForm.rule.separators"
                  class="!rounded-lg"
                  placeholder="请输入分段标识符，按下Enter后添加"
                />
              </a-form-item>
              <a-form-item
                field="chunk_size"
                label="分段最大长度"
                asterisk-position="end"
                :rules="[{ required: true, message: '分段最大长度不能为空' }]"
              >
                <a-input-number
                  v-model:model-value="createDocumentsForm.rule.chunk_size"
                  class="!rounded-lg"
                  :min="100"
                  :max="1000"
                  :step="1"
                  :default-value="500"
                  placeholder="请输入分段最大长度，范围在100-1000之间"
                />
              </a-form-item>
              <a-form-item
                field="chunk_overlap"
                label="分块重叠数"
                asterisk-position="end"
                :rules="[{ required: true, message: '分块重叠数不能为空' }]"
              >
                <a-input-number
                  v-model:model-value="createDocumentsForm.rule.chunk_overlap"
                  class="!rounded-lg"
                  :min="0"
                  :max="500"
                  :step="1"
                  :default-value="50"
                  placeholder="请输入分块重叠数，范围在0-500之间"
                />
              </a-form-item>
              <a-form-item field="pre_process_rules" label="文本预处理规则">
                <a-checkbox-group
                  v-model:model-value="createDocumentsForm.rule.pre_process_rules"
                  direction="vertical"
                >
                  <a-checkbox value="remove_extra_space">删除连续空格、换行符和制表符</a-checkbox>
                  <a-checkbox value="remove_url_and_email">删除所有URL和电子邮箱</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <!--数据处理页面-->
      <div v-if="currentStep === 3">
        <!--数据处理状态-->
        <div
          v-if="
            documents.every(
              (document) => document.status === 'completed' || document.status === 'error',
            )
          "
          class="text-gray-900 mb-4 text-base"
        >
          文档处理完毕
        </div>
        <div v-else class="text-gray-900 mb-4 text-base">文档处理中...</div>
        <!--处理中的文档列表-->
        <div class="flex flex-col gap-2">
          <div
            v-for="document in documents"
            :key="document.id"
            class="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200"
          >
            <!--左侧文件信息-->
            <div class="flex items-center gap-2.5">
              <a-avatar shape="square" class="!bg-blue-700" :size="32">
                <icon-file />
              </a-avatar>
              <div>
                <div class="text-gray-700">{{ document.name }}</div>
                <div class="text-gray-500">{{ (document.size / 1024).toFixed(2) }}KB</div>
              </div>
            </div>
            <!--右侧处理进度百分比-->
            <div v-if="document.segment_count === 0" class="text-gray-500">0.00%</div>
            <div v-else-if="document.status === 'error'">处理异常</div>
            <div v-else-if="document.status === 'completed'">处理完成</div>
            <div v-else class="text-gray-500">
              {{ ((document.completed_segment_count / document.segment_count) * 100).toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--按钮：上一步和下一步-->
    <div class="flex items-center justify-between px-[48px]">
      <div class=""></div>
      <div class="flex items-center gap-2">
        <a-button
          v-if="currentStep === 2"
          class="!rounded-lg"
          @click="
            () => {
              if (currentStep > 1) {
                currentStep--
              }
            }
          "
          >上一步</a-button
        >
        <a-button
          v-if="currentStep <= 2"
          :loading="createDocumentsLoading"
          type="primary"
          class="!rounded-lg"
          @click="nextStep"
          >下一步</a-button
        >
      </div>
      <!--数据处理页面-->
      <div v-if="currentStep === 3" class="flex items-center gap-2">
        <div class="text-gray-500">点击"确定"返回，不会影响正在处理的文档</div>
        <router-link
          :to="{
            name: 'space-datasets-documents-list',
            params: {
              dataset_id: route.params?.dataset_id as string,
            },
          }"
        >
          <a-button type="primary" class="!rounded-lg">确定</a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
