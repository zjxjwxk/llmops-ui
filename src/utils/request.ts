import { apiPrefix, httpCode } from '@/config'
import { Message } from '@arco-design/web-vue'

// 超时时间为100秒
const TIME_OUT = 100000

// fetch默认参数
const baseFetchOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
  redirect: 'follow',
}

// fetch参数类型
type FetchOptionType = Omit<RequestInit, 'body'> & {
  params?: Record<string, any>
  body?: BodyInit | Record<string, any> | null
}

// 封装基础的fetch请求
const baseFetch = <T>(url: string, fetchOptions: FetchOptionType): Promise<T> => {
  // 合并默认参数和传入参数
  const options: typeof baseFetchOptions & FetchOptionType = Object.assign(
    {},
    baseFetchOptions,
    fetchOptions,
  )

  // 拼接URL
  let urlWithPrefix = `${apiPrefix}${url.startsWith('/') ? url : `/${url}`}`

  // 解构出对应的请求方法、params、body参数
  const { method, params, body } = options

  // 如果请求方法是GET，并且传递了params参数，将params参数拼接至URL前缀
  if (method === 'GET' && params) {
    // 将params转化为键值对字符串数组：['key1=value1', 'key2=value2', ...]
    const paramsArray: string[] = []
    Object.keys(params).forEach((key) => {
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`)
    })

    // 将键值对字符串拼接至URL前缀
    if (urlWithPrefix.search(/\?/) === -1) {
      urlWithPrefix += `?${paramsArray.join('&')}`
    } else {
      urlWithPrefix += `&${paramsArray.join('&')}`
    }
  }

  // 删除实际fetch请求中不应该有的params参数
  if (params) {
    delete options.params
  }

  // 将body转为json字符串
  if (body) {
    options.body = JSON.stringify(body)
  }

  // 同时发起两个Promise（只返回先结束的）
  return Promise.race([
    // 使用定时器来检测是否超时
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('接口已超时')
      }, TIME_OUT)
    }),
    // 发起一个正常请求
    new Promise((resolve, reject) => {
      globalThis
        .fetch(urlWithPrefix, options as RequestInit)
        .then(async (res) => {
          const json = await res.json()
          if (json.code === httpCode.success) {
            resolve(json)
          } else {
            Message.error(json.message)
            reject(new Error(json.message))
          }
        })
        .catch((err) => {
          Message.error(err.message)
          reject(err)
        })
    }),
  ]) as Promise<T>
}

// 封装基于POST的SSE(流式事件响应)请求
export const ssePost = (
  url: string,
  fetchOptions: FetchOptionType,
  onData: (data: { [key: string]: any }) => void,
) => {
  // 组装基础fetch请求配置
  const options = Object.assign({}, baseFetchOptions, { method: 'POST' }, fetchOptions)

  // 拼接URL
  const urlWithPrefix = `${apiPrefix}${url.startsWith('/') ? url : `/${url}`}`

  // 解构出body参数
  const { body } = fetchOptions

  // 将body转为json字符串
  if (body) {
    options.body = JSON.stringify(body)
  }

  // 发起fetch请求，并处理流式事件响应
  globalThis.fetch(urlWithPrefix, options as RequestInit).then((response) => {
    return handleStream(response, onData)
  })
}

const handleStream = (response: Response, onData: (data: { [key: string]: any }) => void) => {
  if (!response.ok) {
    throw new Error('网络请求失败')
  }

  // 构建Reader和Decoder
  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')

  let buffer = ''
  // 定义read函数读取流式事件响应数据
  const read = () => {
    let hasError = false
    reader?.read().then((result: any) => {
      if (result.done) {
        return
      }

      buffer += decoder.decode(result.value, { stream: true })
      const lines = buffer.split('\n')

      let event = ''
      let data = ''

      try {
        lines.forEach((line) => {
          line = line.trim()
          if (line.startsWith('event:')) {
            event = line.slice(6).trim()
          } else if (line.startsWith('data:')) {
            data = line.slice(5).trim()
          }

          if (line === '') {
            if (event !== '' && data !== '') {
              onData({
                event: event,
                data: JSON.parse(data),
              })
              event = ''
              data = ''
            }
          }
        })
        buffer = lines.pop() || ''
      } catch (e) {
        hasError = true
      }

      if (!hasError) {
        read()
      }
    })
  }

  // 调用read函数读取流式事件响应数据
  read()
}

export const request = <T>(url: string, options = {}) => {
  return baseFetch<T>(url, options)
}

export const get = <T>(url: string, options = {}) => {
  return request<T>(url, Object.assign({}, options, { method: 'GET' }))
}

export const post = <T>(url: string, options = {}) => {
  return request<T>(url, Object.assign({}, options, { method: 'POST' }))
}
