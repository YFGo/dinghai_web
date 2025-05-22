import request from '../request'
import type { BuiltInRule, RuleFormValues } from '@/types/rules'

  // 获取内置规则
export const getBuiltInRules = () => {
  return request.get<BuiltInRule[]>('/buildinRules')
}

// 新增自定义规则
export const addCustomRule = (data: RuleFormValues) => {
  return request.post<BuiltInRule>('/userRule', data)
}

// 修改自定义规则
export const updateCustomRule = (data: BuiltInRule) => {
  return request.put<BuiltInRule>('/userRule', data) 
}

// 删除自定义规则
export const deleteCustomRule = (id: number) => {
  return request.delete<BuiltInRule>(`/userRule/${id}`)
}