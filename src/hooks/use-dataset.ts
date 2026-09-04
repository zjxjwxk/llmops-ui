import { useRoute } from 'vue-router'
import { onMounted, reactive, ref, watch } from 'vue'
import { getDatasetsWithPage } from '@/services/dataset.ts'

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
