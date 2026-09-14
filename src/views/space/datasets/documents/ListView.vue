<script setup lang="ts">
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'
import {
  useDeleteDocument,
  useGetDataset,
  useGetDocumentsWithPage,
  useUpdateDocumentEnabled,
} from '@/hooks/use-dataset.ts'
import UpdateDocumentNameModal from '@/views/space/datasets/documents/components/UpdateDocumentNameModal.vue'
import { ref } from 'vue'
import HitTestingModal from '@/views/space/datasets/documents/components/HitTestingModal.vue'

const route = useRoute()
const router = useRouter()
const hitTestingModalVisible = ref(false)
const updateDocumentNameModalVisible = ref(false)
const updateDatasetID = ref('')
const updateDocumentID = ref('')
const { dataset, loadDataset } = useGetDataset(route.params?.dataset_id as string)
const { loading, documents, paginator, loadDocuments } = useGetDocumentsWithPage(
  route.params?.dataset_id as string,
)
const { handleUpdateEnabled } = useUpdateDocumentEnabled()
const { handleDelete } = useDeleteDocument()
</script>

<template>
  <div class="p-6">
    <!--顶部知识库详情-->
    <div class="flex items-center w-full gap-2 mb-6">
      <!--回退按钮-->
      <router-link :to="{ name: 'space-datasets-list' }">
        <a-button size="small" type="text" class="!text-gray-700">
          <template #icon>
            <icon-left />
          </template>
        </a-button>
      </router-link>
      <!--右侧知识库信息-->
      <div class="flex items-center gap-3">
        <!--知识库图标-->
        <a-avatar :size="40" shape="square" class="rounded-lg" :image-url="dataset.icon" />
        <!--知识库信息-->
        <div class="flex flex-col justify-between h-[40px]">
          <a-skeleton-line v-if="!dataset?.name" :widths="[100]" />
          <div v-else class="text-gray-700">知识库 / {{ dataset.name }}</div>
          <div v-if="!dataset?.name" class="flex items-center gap-2">
            <a-skeleton-line :widths="[60]" :line-height="18" />
            <a-skeleton-line :widths="[60]" :line-height="18" />
            <a-skeleton-line :widths="[60]" :line-height="18" />
          </div>
          <div v-else class="flex items-center gap-2">
            <a-tag size="small" class="rounded h-[18px] leading-[18px] bg-gray-200 text-gray-500"
              >{{ dataset.document_count }} 文档</a-tag
            >
            <a-tag size="small" class="rounded h-[18px] leading-[18px] bg-gray-200 text-gray-500"
              >{{ dataset.hit_count }} 命中</a-tag
            >
            <a-tag size="small" class="rounded h-[18px] leading-[18px] bg-gray-200 text-gray-500"
              >{{ dataset.related_app_count }} 关联应用</a-tag
            >
          </div>
        </div>
      </div>
    </div>
    <!--中间检索及召回测试-->
    <div class="flex items-center justify-between mb-6">
      <!--左侧搜索框-->
      <a-input-search
        :default-value="route.query?.search_word || ''"
        placeholder="请输入文档关键词"
        class="!w-[240px] bg-white !rounded-lg border-gray-200"
        @search="
          (value: string) => {
            router.push({
              path: route.path,
              query: { search_word: value, current_page: 1 },
            })
          }
        "
      />
      <!--右侧按钮-->
      <a-space :size="12">
        <a-button class="!rounded-lg" @click="hitTestingModalVisible = true">召回测试</a-button>
        <router-link
          :to="{
            name: 'space-datasets-documents-create',
            params: { dataset_id: route.params?.dataset_id as string },
          }"
        >
          <a-button type="primary" class="!rounded-lg">添加文档</a-button>
        </router-link>
      </a-space>
    </div>
    <!--底部表格-->
    <div>
      <!--表格内容-->
      <a-table
        hoverable
        :pagination="{
          total: paginator.total_record,
          current: paginator.current_page,
          defaultCurrent: 1,
          pageSize: paginator.page_size,
          defaultPageSize: 20,
          showTotal: true,
        }"
        :loading="loading"
        :data="documents"
        :bordered="{ wrapper: false }"
        @page-change="
          (current_page: number) => {
            router.push({
              path: route.path,
              query: { ...route.query, current_page: current_page },
            })
          }
        "
      >
        <template #columns>
          <a-table-column
            title="#"
            data-index="position"
            align="center"
            :width="80"
            header-cell-class="rounded-tl-lg !bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
          />
          <a-table-column
            title="文档名"
            data-index="name"
            :width="400"
            header-cell-class="!bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
          >
            <template #cell="{ record }">
              <div class="line-clamp-1">
                {{ record.name }}
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="字符数"
            data-index="character_count"
            header-cell-class="!bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
          >
            <template #cell="{ record }">
              {{ (record.character_count / 1000).toFixed(1) }}k
            </template>
          </a-table-column>
          <a-table-column
            title="召回次数"
            data-index="hit_count"
            header-cell-class="!bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
          />
          <a-table-column
            title="上传时间"
            data-index="created_at"
            header-cell-class="!bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
          >
            <template #cell="{ record }">
              {{ moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </a-table-column>
          <a-table-column
            title="状态"
            data-index="enabled"
            header-cell-class="!bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
          >
            <template #cell="{ record }">
              <a-space>
                <div
                  v-if="record.enabled"
                  class="w-2 h-2 bg-green-500 rounded-sm border border-green-700"
                ></div>
                <div v-else class="w-2 h-2 bg-gray-500 rounded-sm border border-gray-700"></div>
                <div v-if="record.enabled" class="text-gray-700">启用</div>
                <div v-else class="text-gray-700">禁用</div>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column
            title="操作"
            data-index="operator"
            header-cell-class="rounded-tr-lg !bg-gray-200 text-gray-700"
            cell-class="bg-transparent"
            :width="100"
          >
            <template #cell="{ record, rowIndex }">
              <a-space :size="0">
                <template #split>
                  <a-divider direction="vertical" />
                </template>
                <a-tooltip
                  v-if="record.status === 'error'"
                  :content="`文档解析失败：${record.error}，无法启用`"
                >
                  <a-switch size="small" type="round" :default-checked="false" disabled />
                </a-tooltip>
                <a-switch
                  v-else
                  size="small"
                  type="round"
                  :model-value="record.enabled"
                  @change="
                    (enabled) => {
                      handleUpdateEnabled(
                        route.params?.dataset_id as string,
                        record.id,
                        enabled as boolean,
                        async () => {
                          documents[rowIndex].enabled = enabled
                        },
                      )
                    }
                  "
                />
                <a-dropdown position="br">
                  <a-button type="text" size="small" class="!text-gray-700 !rounded-lg">
                    <template #icon>
                      <icon-more />
                    </template>
                  </a-button>
                  <template #content>
                    <a-doption
                      @click="
                        () => {
                          updateDocumentNameModalVisible = true
                          updateDatasetID = route.params?.dataset_id as string
                          updateDocumentID = record.id
                        }
                      "
                      >重命名</a-doption
                    >
                    <a-doption
                      class="!text-red-700"
                      @click="
                        () =>
                          handleDelete(route.params?.dataset_id as string, record.id, async () => {
                            await loadDocuments()
                            await loadDataset(route.params?.dataset_id as string)
                          })
                      "
                      >删除</a-doption
                    >
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <!--更新文档名称模态窗-->
    <update-document-name-modal
      v-model:visible="updateDocumentNameModalVisible"
      :dataset_id="updateDatasetID"
      :document_id="updateDocumentID"
      :on-after-update="() => loadDocuments()"
    />
    <!--召回测试模态窗-->
    <hit-testing-modal
      v-model:visible="hitTestingModalVisible"
      :dataset_id="route.params?.dataset_id as string"
    />
  </div>
</template>

<style scoped></style>
