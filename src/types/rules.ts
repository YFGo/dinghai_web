// 声明类型
export interface BuiltInRule {
  id: number
  name: string
  description: string
}

export interface RuleFormValues {
  name: string
  description: string
  risk_level: number
  group_id: string
  seclang_mod: {
    match_goal: string
    match_action: string
    match_content: string
  }
}