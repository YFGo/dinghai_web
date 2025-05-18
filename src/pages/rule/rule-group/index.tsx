import { useState } from 'react'
import { Breadcrumb, Card, Flex, Input, Button } from 'antd'
import { useRouter } from '@/router/hooks/use-router'

import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { RuleGroupDetail } from './rule-group-detail'
import { RuleTable } from './rule-table'

export default function RuleGroup() {

  const router = useRouter()

  // 状态管理
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list')

  // 面包屑配置
  const breadcrumbItems: ItemType[] = [
    {
      title: '规则组列表',
      onClick: () => {
        setSelectedRuleId(null)
        setCurrentView('list')
      },
    },
    currentView === 'detail' && {
      title: '规则组详情',
    }
  ].filter(Boolean) as ItemType[]

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      {/* 内容区域 */}
      {currentView === 'list' ? (
        <div>
          <Card className="my-2">
            <Flex className="justify-between">
              <div className="flex gap-4">
                <Input className="w-48 h-10" placeholder="规则名称" />
                <Input className="w-48 h-10" placeholder="Basic usage" />
                <Input className="w-48 h-10" placeholder="Basic usage" />
                <Input className="w-48 h-10" placeholder="Basic usage" />
                <Input className="w-48 h-10" placeholder="Basic usage" />
              </div>
              <Button>刷新</Button>
            </Flex>
          </Card>
          <Card>
            <div>
              <Button color="primary" variant="outlined">
                新增规则组
              </Button>
              <Button color="primary" variant="outlined" className="mx-3 mb-3">
                批量导出
              </Button>
              <Button color="primary" variant="outlined">
                批量删除
              </Button>
            </div>
            <div>
              <RuleTable
                onViewDetail={record => {
                  setSelectedRuleId(record.key)
                  setCurrentView('detail')
                }}
              />
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <RuleGroupDetail ruleId={selectedRuleId} goBack={()=>{
            setSelectedRuleId(null)
            setCurrentView('list')
          }} />
        </Card>
      )}
    </div>
  )
}
