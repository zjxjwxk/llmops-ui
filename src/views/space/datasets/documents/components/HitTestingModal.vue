<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'

const props = defineProps({
  visible: { type: Boolean, default: true },
  dataset_id: { type: String, required: true },
})
const emits = defineEmits(['update:visible'])
const loading = ref(false)
const data = [
  {
    created_at: 1786855722,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: 'e24ea57d-3164-48c9-a188-8ad0f434fec6',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: 'c1a1e7b6-e515-4087-bda8-99f6141f1bd2',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '6a719201-7c26-4e77-809a-1b416fa6fc25',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '722182f9-5f4d-4b1b-bedc-3709a433d3be',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '74a97998-8a15-41b5-8f2f-92936d289588',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '79fd2df9-820c-42aa-8bc4-afaf706c32bc',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '30fe74eb-44dd-4d92-8a44-54882e15e126',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '07574a0b-974d-4b6c-9b9f-9b2b4ba9b36b',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '4e99f9de-16b8-4d42-88f3-85e6a214be81',
    query: 'Xinkang',
    source: 'hit_testing',
  },
  {
    created_at: 1786855721,
    dataset_id: '735369fd-aef6-414a-8e66-11e940d34b08',
    id: '00b44305-3360-49a9-a54c-8a529a857cda',
    query: 'Xinkang',
    source: 'hit_testing',
  },
]

// 关闭模态窗，并重置表单
const hideModal = () => {
  emits('update:visible', false)
}
</script>

<template>
  <div class="">
    <!--召回测试模态窗-->
    <a-modal
      :width="1000"
      :visible="true"
      hide-title
      :footer="false"
      modal-class="rounded-xl h-3/4 overflow-auto scrollbar-w-none"
      @cancel="hideModal"
    >
      <!--顶部标题-->
      <div class="flex items-center justify-between">
        <div class="text-lg font-bold text-gray-700">召回测试</div>
        <a-button type="text" class="!text-gray-700" size="small" @click="hideModal">
          <template #icon>
            <icon-close />
          </template>
        </a-button>
      </div>
      <!--副标题-->
      <div class="text-gray-500">输入查询文本，测试知识库的召回效果</div>
      <!--中间内容区-->
      <div class="w-full flex justify-between gap-2">
        <!--左侧输入框及最近查询-->
        <div class="flex flex-col w-1/2">
          <!--顶部输入框-->
          <div class="border border-blue-700 bg-blue-100 rounded-lg flex flex-col mb-6">
            <!--输入框标题-->
            <div class="flex items-center justify-between px-4 py-1.5">
              <div class="font-bold text-gray-900">源文本</div>
              <a-button size="small" class="!rounded-lg px-2">
                <template #icon>
                  <icon-language />
                </template>
                向量检索
              </a-button>
            </div>
            <!--输入框容器-->
            <div class="bg-white rounded-lg p-2">
              <!--输入框-->
              <a-textarea
                placeholder="请输入查询文本，建议使用简短的陈述句"
                :max-length="200"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                class="!bg-white !border-0 mb-1"
              />
              <!--字符限制和召回按钮-->
              <div class="flex items-center justify-between">
                <a-tag size="small" class="rounded text-gray-700">0/200</a-tag>
                <a-button type="primary" size="small" class="!rounded-lg">召回测试</a-button>
              </div>
            </div>
          </div>
          <!--底部最近查询-->
          <div class="">
            <div class="text-gray-700 font-bold mb-4">最近查询</div>
            <a-table :pagination="false" size="small" :bordered="{ wrapper: false }" :data="data">
              <template #columns>
                <a-table-column
                  title="数据源"
                  data-index="source"
                  header-cell-class="text-gray-500 !bg-transparent border-b border-gray-200 !font-bold"
                  cell-class="text-gray-500"
                  :width="110"
                />
                <a-table-column
                  title="文本"
                  data-index="query"
                  header-cell-class="text-gray-500 !bg-transparent border-b border-gray-200 !font-bold"
                  cell-class="text-gray-500"
                >
                  <template #cell="{ record }">
                    <div class="line-clamp-1">
                      {{ record.query }}
                    </div>
                  </template>
                </a-table-column>
                <a-table-column
                  title="时间"
                  data-index="created_at"
                  header-cell-class="text-gray-500 !bg-transparent border-b border-gray-200 !font-bold"
                  cell-class="text-gray-500"
                >
                  <template #cell="{ record }">
                    <div class="">
                      {{ moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm') }}
                    </div>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
        </div>
        <a-divider direction="vertical" />
        <!--右侧召回列表-->
        <div class="w-1/2">
          <a-row :gutter="[16, 16]">
            <a-col v-for="n in 10" :key="n" :span="12">
              <div class="p-4 bg-gray-50 rounded-lg cursor-pointer">
                <!--顶部得分部分-->
                <div class="flex items-center gap-2 mb-1.5">
                  <icon-pushpin />
                  <a-progress :stroke-width="6" :show-text="false" :percent="0.45" />
                  <div class="text-gray-700 text-xs">0.45</div>
                </div>
                <!--中间内容部分-->
                <div class="text-gray-500 line-clamp-4">
                  这段提示词可以让 ChatGPT 更好地回复关于后端出现的疑难杂症，提示词如下\n\n#
                  角色\n\n作为一个拥有10年Python应用经验的工程师，你现在正在使用Flask、Flask-Login、Flask-SQLAlchemy、PostgreSQL、JWT、Flask-Migrate、wtforms、Flask-WTF和Celery开发一个名为“LLMOps接口”的后端API项目。\n\n##
                  技能\n\n### 技能1:
                  Flask框架使用\n\n你的知识库包括处理Flask框架的各种实际工作场景和常见问题。\n\n###
                  技能2:
                  Flask-Login、Flask-SQLAlchemy、PostgreSQL\n\n你能够解决和这些技术相关的问题，并且你有SQL数据库的丰富经验，可以为用户处理包括用户验证管理、数据库模型设计和实现、以及数据存储等问题。\n\n###
                  技能3:
                  JWT、Flask-Migrate、wtforms、Flask-WTF、Celery\n\n无论是API认证问题，数据迁移，还是表单验证和异步任务处理，你都有能力进行深入解答。\n\n##
                  限制\n\n只处理与“LLMOps接口”项目相关的问题。\n\n根据提出的问题或错误提供解决方案。\n\n确保答案的准确性。\n\n在解答问题或错误时必须用代码示例来讲解每一步的解决方法和原理。\n\n如果出现未知的问题或错误，请引导用户继续提供相关信息并回答。\n\n对于用户提出的问题或错误，你的回应格式应为:\n\n=====\n\n问题/错误描述:
                  &lt;用户描述&gt;\n\n提供的解决方案: &lt;解决方案&gt;
                </div>
                <!--底部文档归属-->
                <a-divider class="my-2" />
                <div class="flex items-center gap-2 text-gray-500 text-xs">
                  <icon-file class="flex-shrink-0" />
                  <div class="line-clamp-1">课程Prompt提示词.txt</div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
    <!--检索设置模态窗-->
    <a-modal :visible="true" hide-title :footer="false" modal-class="rounded-xl">
      <!--顶部标题-->
      <div class="flex items-center justify-between">
        <div class="text-lg font-bold text-gray-700">检索设置</div>
        <a-button type="text" class="!text-gray-700" size="small" @click="hideModal">
          <template #icon>
            <icon-close />
          </template>
        </a-button>
      </div>
      <!--中间表单-->
      <a-form class="pt-6">
        <a-form-item field="retrieval_strategy" label="检索策略" label-align="left">
          <a-radio-group
            default-value="semantic"
            :options="[
              { label: '混合策略', value: 'hybrid' },
              { label: '全文检索', value: 'full_text' },
              { label: '相似性检索', value: 'semantic' },
            ]"
          />
        </a-form-item>
        <a-form-item field="k" label="最大召回数量">
          <div class="flex items-center gap-4 w-full pl-3">
            <a-slider :step="1" :min="1" :max="10" />
            <a-input-number class="!w-[80px]" :default-value="4" />
          </div>
        </a-form-item>
        <a-form-item field="score" label="最小匹配度">
          <div class="flex items-center gap-4 w-full pl-3">
            <a-slider :step="0.01" :min="0" :max="0.99" />
            <a-input class="!w-[80px]" :default-value="0.5" />
          </div>
        </a-form-item>
        <!--底部按钮-->
        <div class="flex items-center justify-between">
          <div class=""></div>
          <a-space :size="16">
            <a-button class="!rounded-lg" @click="hideModal">取消</a-button>
            <a-button :loading="loading" type="primary" html-type="submit" class="!rounded-lg"
              >保存</a-button
            >
          </a-space>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped></style>
