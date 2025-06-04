import request from '../request'
import type {BaseResponse} from '@/types/api'

// 声明类型
export interface BuiltInRule {
  id: number
  name: string
  description: string
}

// 规则类型
export interface RuleValues {
  id: number
  name: string
  description: string
  risk_level: number
  group_id: number
  seclang_mod: {
    match_goal: string
    match_action: string
    match_content: string
  }
}

export interface RuleGroupValues {
  name: string
  description: string
  is_buildin: number
}

export interface RuleGroupResponse extends RuleGroupValues {
  id: number
}

export interface RuleGroupInfo  {
  id: number,
  is_buildin: number,
}

// 获取内置规则列表
export const getBuiltInRules = () => {
  return request.get<BuiltInRule[]>('/buildinRules')
}

// 获取内置规则详情
export const getBuiltInRuleDetail = (id: number) => {
  return request.get<BuiltInRule>(`/buildinRule/${id}`)
}

// 获取自定义规则
export const getCustomRules = () => {
  return request.get<RuleValues[]>('/userRules')  
}

// 新增自定义规则
export const addCustomRule = (data: RuleValues) => {
  return request.post<BaseResponse>('/userRule', data)
}

// 修改自定义规则
export const updateCustomRule = (data: RuleValues) => {
  return request.put<BaseResponse>('/userRule', data)
}

// 删除自定义规则
export const deleteCustomRule = (ids: React.Key[]) => {
  return request.delete<BaseResponse>('/userRule', { data: ids })
}

// 获取规则组列表
export const getRuleGroups = () => {
  return request.get<RuleGroupResponse[]>('/ruleGroups')
}

// 获取规则组详情
export const getRuleGroupDetail = (id: number) => {
  return request.get(`/ruleGroup/${id}`)
}

// 新增规则组
export const addRuleGroup = (data: RuleGroupValues) => {
  return request.post('/ruleGroup', data)
}

// 修改规则组
export const updateRuleGroup = (data: RuleGroupValues) => {
  return request.put('/ruleGroup', data)
}

// 删除规则组
export const deleteRuleGroup = (delete_rule_group_infos: RuleGroupInfo[]) => {
  return request.delete('/ruleGroup', { data: delete_rule_group_infos })
}