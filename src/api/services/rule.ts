import request from '../request'
import type { BuiltInRule, RuleFormValues } from '@/types/rules'
import type {BaseResponse} from '@/types/api'

  // 获取内置规则
export const getBuiltInRules = () => {
  return request.get<BuiltInRule[]>('/buildinRules')
}

// 获取自定义规则
export const getCustomRules = () => {
  return request.get<RuleFormValues[]>('/userRules')  
}

// 新增自定义规则
export const addCustomRule = (data: RuleFormValues) => {
  return request.post<BaseResponse>('/userRule', data)
}

// 修改自定义规则
export const updateCustomRule = (data: RuleFormValues) => {
  return request.put<BaseResponse>('/userRule', data) 
}

// 删除自定义规则
export const deleteCustomRule = (ids: React.Key[]) => {
  return request.delete<BaseResponse>('/userRule', { data: ids })
}