import request from '../request'
import type { BuiltInRule } from '@/types/rules'

export const getBuiltInRules = () => {
  return request.get<BuiltInRule[]>('/rule/builtInRules')
}
