// API请求接口前缀
export const apiPrefix: string = 'http://localhost:5001'

// 业务状态码
export const httpCode = {
  success: 'success',
  fail: 'fail',
  notFound: 'not_found',
  unauthorized: 'unauthorized',
  forbidden: 'forbidden',
  validateError: 'validate_error',
}

// 参数类型的中文映射
export const typeMap = {
  // 自定义API工具参数类型（Python类型）
  str: '字符串',
  int: '整型',
  float: '浮点型',
  bool: '布尔型',

  // 内置工具参数类型（JSON Schema类型）
  string: '字符串',
  integer: '整型',
  number: '浮点型',
  boolean: '布尔型',
}
