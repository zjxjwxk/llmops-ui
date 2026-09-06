import { useRoute } from 'vue-router'
import { onMounted, reactive, ref, watch } from 'vue'
import {
  createDataset,
  deleteDataset,
  deleteDocument,
  getDataset,
  getDatasetsWithPage,
  getDocumentsWithPage,
  updateDataset,
  updateDocumentEnabled,
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
      Object.assign(paginator, defaultPaginator)
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
      Object.assign(paginator, data.paginator)

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

export const useGetDataset = (dataset_id: string) => {
  const loading = ref(false)
  const dataset = reactive<any>({})

  // 加载知识库详情
  const loadDataset = async (dataset_id: string) => {
    try {
      loading.value = true
      const resp = await getDataset(dataset_id)
      const data = resp.data
      Object.assign(dataset, data)
    } finally {
      loading.value = false
    }
  }

  // 页面加载时初始化数据
  onMounted(async () => {
    await loadDataset(dataset_id)
  })

  return { loading, dataset, loadDataset }
}

export const useGetDocumentsWithPage = (dataset_id: string) => {
  const route = useRoute()
  const loading = ref(false)
  const documents = reactive<Array<any>>([])
  const defaultPaginator = {
    current_page: 1,
    page_size: 20,
    total_page: 0,
    total_record: 0,
  }
  const paginator = reactive({ ...defaultPaginator })

  // 加载文档列表
  const loadDocuments = async (init: boolean = false) => {
    // 检测是否需要初始化分页器
    if (init) {
      Object.assign(paginator, defaultPaginator)
    } else if (!init && paginator.current_page > paginator.total_page) {
      // 检测是否还有更多数据需要加载
      return
    }

    // 加载更多数据
    try {
      loading.value = true
      const resp = await getDocumentsWithPage(dataset_id, {
        current_page: Number(route.query?.current_page || paginator.current_page),
        page_size: Number(route.query?.page_size || paginator.page_size),
        search_word: String(route.query?.search_word ?? ''),
      })
      const data = resp.data

      // 更新分页器
      Object.assign(paginator, data.paginator)

      // 列表分页直接覆盖数据
      documents.splice(0, documents.length, ...data.list)
    } finally {
      loading.value = false
    }
  }

  // 页面加载时初始化数据
  onMounted(async () => {
    await loadDocuments(true)
  })

  // 监听路由变化
  watch(
    () => route.query,
    async (newQuery, oldQuery) => {
      if (newQuery.search_word != oldQuery.search_word) {
        await loadDocuments(true)
      } else if (
        newQuery.current_page != oldQuery.current_page ||
        newQuery.page_size != oldQuery.page_size
      ) {
        await loadDocuments()
      }
    },
  )

  return { loading, documents, paginator, loadDocuments }
}

export const useDeleteDocument = () => {
  const handleDelete = (dataset_id: string, document_id: string, callback?: () => void) => {
    Modal.warning({
      title: '是否确认删除此文档？',
      content:
        '该操作无法撤销，所有该文档下的片段都将被永久删除，AI 应用将无法使用该文档，如需暂时关闭文档，请使用禁用功能。',
      hideCancel: false,
      onOk: async () => {
        try {
          const resp = await deleteDocument(dataset_id, document_id)
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

export const useUpdateDocumentEnabled = () => {
  const handleUpdateEnabled = async (
    dataset_id: string,
    document_id: string,
    enabled: boolean,
    callback?: () => void,
  ) => {
    try {
      const resp = await updateDocumentEnabled(dataset_id, document_id, enabled)
      Message.success(resp.message)
    } finally {
      callback && callback()
    }
  }

  return { handleUpdateEnabled }
}
