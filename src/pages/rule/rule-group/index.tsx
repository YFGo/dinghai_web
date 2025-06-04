import { useEffect, useState } from 'react'
import { Breadcrumb, Card, Flex, Input, Button, Form, Select,message } from 'antd'

import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { RuleGroupDetail } from './rule-group-detail'
import { RuleTable } from './rule-table'
import { useWafDrawer } from '@/hooks/waf-drawer'
import type { RuleGroupInfo, RuleGroupResponse } from '@/api/services/rule'

import { getRuleGroups, addRuleGroup, updateRuleGroup, deleteRuleGroup } from '@/api/services/rule'

type RuleGroupViewState = {
  view: 'list' | 'detail'
  selectedRuleId: number | null
}

export default function RuleGroup() {
  // 当前视图状态
  const [viewState, setViewState] = useState<RuleGroupViewState>({
    view: 'list',
    selectedRuleId: null
  })
  // 表单实例
  const [form] = Form.useForm<RuleGroupResponse>()
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 根据type判断是修改还是新增规则
  const [type, setType] = useState<'add' | 'edit'>('add')
  // 规则组列表数据
  const [data, setData] = useState<RuleGroupResponse[]>([])

  // 自定义抽屉
  const { showDrawer, renderDrawer } = useWafDrawer({
    defaultTitle: '新增自定义规则',
    width: 600
  })

  // 打开新增规则组抽屉
  const hadnleAdd = async () => {
    setType('add')
    // 重置表单
    form.resetFields()
    showWafDrawer()
  }

  // 打开修改规则组抽屉
  const handleEdit = (record: RuleGroupResponse) => {
    setType('edit')
    form.setFieldsValue(record)
    showWafDrawer()
  }

  // 获取规则组列表方法
  const fetchRuleGroups = async () => {
    try {
      setLoading(true)
      const data = await getRuleGroups()
      console.log(data)
      // setData(data)
    } catch (error) {
      console.error('获取规则组列表失败', error)
      message.error('获取规则组列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 新增/修改规则组提交方法
  const handleSubmit = async (values: RuleGroupResponse) => {
    try {
      setLoading(true)
      if (type === 'add') {
        await addRuleGroup(values)
      } else {
        await updateRuleGroup(values)
      }
      message.success('操作成功')
    } catch (error) {
      console.error('操作失败', error)
      message.error('操作失败')
    } finally {
      setLoading(false)
    }
  }
  // 删除规则组方法
  const handleDeleteRuleGroup = async (info: RuleGroupInfo[]) => {
    try {
      setLoading(true)
      await deleteRuleGroup(info)
    } catch (error) {
      console.error('删除规则组失败', error)
      message.error('删除规则组失败')
    } finally {
      setLoading(false)
    }
  }

  // 查看详情
  const showRuleGroupDetail = (ruleId: number) => {
    setViewState({ view: 'detail', selectedRuleId: ruleId })
  }

  // 返回列表
  const handleBackToList = () => {
    setViewState({ view: 'list', selectedRuleId: null })
  }

  // 面包屑配置
  const breadcrumbItems: ItemType[] = [
    {
      title: '规则组列表',
      onClick: handleBackToList
    },
    viewState.view === 'detail' && {
      title: '规则组详情'
    }
  ].filter(Boolean) as ItemType[]

  // 显示抽屉
  const showWafDrawer = () => {
    showDrawer({
      title: type === 'add' ? '新增规则组' : '修改规则组',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item label="规则名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="规则描述" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="规则类型" name="is_buildin">
            <Select>
              <Select.Option value={1}>内置规则组</Select.Option>
              <Select.Option value={2}>非内置规则组</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
      onOk(close) {
        form.validateFields().then(async values => {
          await handleSubmit(values)
          close()
        })
      }
    })
  }

  useEffect(() => {
    fetchRuleGroups()
  }, [])

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      {/* 内容区域 */}
      {viewState.view === 'list' ? (
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
              <Button color="primary" variant="outlined" onClick={hadnleAdd}>
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
                onViewDetail={(ruleId: number) => {
                  showRuleGroupDetail(ruleId)
                }}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDeleteRuleGroup}
                loading={loading}
              />
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <RuleGroupDetail ruleId={viewState.selectedRuleId} goBack={handleBackToList} />
        </Card>
      )}
      {renderDrawer()}
    </div>
  )
}
