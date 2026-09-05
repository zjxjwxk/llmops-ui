import { useRoute } from 'vue-router'
import { onMounted, reactive, ref, watch } from 'vue'
import {
  createDataset,
  deleteDataset,
  getDatasetsWithPage,
  updateDataset,
} from '@/services/dataset.ts'
import { Form, Message, Modal } from '@arco-design/web-vue'

export const useGetDatasetsWithPage = () => {
  // 定义数据
  const route = useRoute()
  const loading = ref(false)
  const datasets = reactive<Array<any>>([])
  const defaultPaginator = {
    current_page: 1,
    page_size: 20,
    total_page: 0,
    total_record: 0,
  }
  const paginator = reactive({ ...defaultPaginator })

  // 加载知识库
  const loadDatasets = async (init: boolean = false) => {
    // 检测是否需要初始化分页器
    if (init) {
      initPaginator()
    } else if (!init && paginator.current_page > paginator.total_page) {
      // 检测是否还有更多数据需要加载
      return
    }

    // 加载更多数据
    try {
      // 调用接口获取数据
      loading.value = true
      const resp = await getDatasetsWithPage(
        paginator.current_page,
        paginator.page_size,
        String(route.query?.search_word ?? ''),
      )
      const data = resp.data

      // 更新分页器
      updatePaginator(data)

      // 判断是否存在更多数据
      if (paginator.current_page <= paginator.total_page) {
        paginator.current_page += 1
      }

      // 初始化则覆盖数据
      if (init) {
        datasets.splice(0, datasets.length, ...data.list)
      } else {
        // 否则追加数据
        datasets.push(...data.list)
      }
    } finally {
      loading.value = false
    }
  }

  // 初始化分页器
  const initPaginator = () => {
    Object.assign(paginator, defaultPaginator)
  }

  // 更新分页器
  const updatePaginator = (data: any) => {
    Object.assign(paginator, data.paginator)
  }

  // 页面加载时初始化数据
  onMounted(async () => {
    await loadDatasets(true)
  })

  // 监听路由变化
  watch(
    () => route.query?.search_word,
    async () => {
      await loadDatasets(true)
    },
  )

  return { loading, datasets, paginator, loadDatasets }
}

export const useDeleteDataset = () => {
  const handleDelete = (dataset_id: string, callback?: () => void) => {
    Modal.warning({
      title: '是否确认删除此知识库？',
      content: '该操作无法撤销，所有该知识库下的文档都将被永久删除，AI 应用将无法使用该知识库。',
      hideCancel: false,
      onOk: async () => {
        try {
          const resp = await deleteDataset(dataset_id)
          Message.success(resp.message)
        } finally {
          // 调用回调函数
          callback && callback()
        }
      },
    })
  }

  return { handleDelete }
}

export const useCreateOrUpdateDataset = () => {
  // 定义创建和更新需要的数据
  const loading = ref(false)
  const defaultForm = {
    icon: 'https://picsum.photos/400',
    name: '',
    description: '',
  }
  const form = reactive({ ...defaultForm })
  const formRef = ref<InstanceType<typeof Form>>(null)
  const showUpdateModal = ref(false)

  // 更新showUpdateModal
  const updateShowUpdateModal = (new_value: boolean, callback?: () => void) => {
    showUpdateModal.value = new_value
    callback && callback()
  }

  // 提交表单
  const saveDataset = async (dataset_id?: string) => {
    try {
      loading.value = true
      if (dataset_id !== undefined && dataset_id != '') {
        const resp = await updateDataset(dataset_id, form)
        Message.success(resp.message)
      } else {
        const resp = await createDataset(form)
        Message.success(resp.message)
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, form, formRef, showUpdateModal, updateShowUpdateModal, saveDataset }
}
