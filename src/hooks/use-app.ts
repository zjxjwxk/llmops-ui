import { onMounted, reactive, ref } from 'vue'
import {
  cancelPublish,
  fallbackHistoryToDraft,
  getApp,
  getPublishHistoriesWithPage,
  publish,
} from '@/services/app.ts'
import { Message, Modal } from '@arco-design/web-vue'
import { deleteSegment } from '@/services/dataset.ts'

export const useGetApp = (app_id: string) => {
  const loading = ref(false)
  const app = reactive<Record<string, any>>({})

  const loadApp = async (app_id: string) => {
    try {
      loading.value = true

      const resp = await getApp(app_id)
      const data = resp.data

      Object.assign(app, { ...data })
    } finally {
      loading.value = false
    }
  }

  // 页面DOM加载完毕时，加载数据
  onMounted(async () => await loadApp(app_id))

  return { loading, app, loadApp }
}

export const usePublish = () => {
  const loading = ref(false)

  const handlePublish = async (app_id: string) => {
    try {
      loading.value = true

      const resp = await publish(app_id)
      Message.success(resp.message)
    } finally {
      loading.value = false
    }
  }

  return { loading, handlePublish }
}

export const useCancelPublish = () => {
  const loading = ref(false)

  const handleCancelPublish = async (app_id: string, callback?: () => void) => {
    Modal.warning({
      title: '是否确认取消发布该Agent应用？',
      content:
        '取消发布后，WebApp及发布的社交平台均无法再使用该Agent；如需更新WebApp地址，请使用地址重新生成功能。',
      hideCancel: false,
      onOk: async () => {
        try {
          loading.value = true

          // 点击确定后向API接口发起请求
          const resp = await cancelPublish(app_id)
          Message.success(resp.message)
        } finally {
          loading.value = false

          // 调用callback函数执行取消发布后操作
          callback && callback()
        }
      },
    })
  }

  return { loading, handleCancelPublish }
}

export const useGetPublishHistoriesWithPage = () => {
  const loading = ref(false)
  const defaultPaginator = {
    current_page: 1,
    page_size: 20,
    total_page: 0,
    total_record: 0,
  }
  const publishHistories = reactive<Array<Record<string, any>>>([])
  const paginator = reactive({ ...defaultPaginator })

  const loadPublishHistories = async (app_id: string, init: boolean = false) => {
    try {
      // 初始化分页器
      if (init) {
        Object.assign(paginator, { ...defaultPaginator })
      } else if (paginator.current_page > paginator.total_page) {
        return
      }

      // 调用API接口获取数据
      loading.value = true
      const resp = await getPublishHistoriesWithPage(app_id, {
        current_page: paginator.current_page,
        page_size: paginator.page_size,
      })
      const data = resp.data

      // 更新分页器
      paginator.current_page = data.paginator.current_page
      paginator.page_size = data.paginator.page_size
      paginator.total_page = data.paginator.total_page
      paginator.total_record = data.paginator.total_record

      // 是否存在更多数据
      if (paginator.current_page <= paginator.total_page) {
        paginator.current_page += 1
      }

      // 初始化 => 覆盖数据
      if (init) {
        publishHistories.splice(0, publishHistories.length, ...data.list)
      } else {
        // 加载更多数据
        publishHistories.push(...data.list)
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, publishHistories, paginator, loadPublishHistories }
}

export const useFallbackHistoryToDraft = () => {
  const loading = ref(false)

  const handleFallbackHistoryToDraft = async (
    app_id: string,
    app_config_version_id: string,
    callback?: () => void,
  ) => {
    try {
      loading.value = true

      const resp = await fallbackHistoryToDraft(app_id, app_config_version_id)
      Message.success(resp.message)
    } finally {
      loading.value = false
      callback && callback()
    }
  }

  return { loading, handleFallbackHistoryToDraft }
}
