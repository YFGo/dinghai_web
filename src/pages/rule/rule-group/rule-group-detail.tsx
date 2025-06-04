import { useEffect, useState } from 'react'
import { Table, Card, Button, Space, Form, Row, Col, Input, Select } from 'antd'
import type { TableColumnsType } from 'antd'
import { useWafDrawer } from '@/hooks/waf-drawer'
import { getRuleGroupDetail } from '@/api/services/rule'
import { RuleValues } from '@/api/services/rule'

const { Option } = Select

interface DetailProps {
  ruleId: number | null
  goBack: () => void
}

export const RuleGroupDetail = ({ ruleId, goBack }: DetailProps) => {
  const [data, setData] = useState<RuleValues[]>([])
  const [loading, setLoading] = useState(false)
  // 表单实例
  const [form] = Form.useForm<RuleValues>()

  // 获取规则组详情数据
  const fetchRuleGroupDetail = async (ruleId: number) => {
    try {
      setLoading(true)
      const response = await getRuleGroupDetail(ruleId)
      setData(response.data)
    } catch (error) {
      console.error('获取规则组详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 编辑规则组
  const onEdit = (record: RuleValues) => {
    console.log('编辑规则组:', record)
    form.setFieldsValue(record)
    showWafDrawer()
  }

  // 根据 ruleId 获取详情数据的逻辑
  useEffect(() => {
    if (ruleId) {
      fetchRuleGroupDetail(ruleId)
    }
    // 模拟数据
    setTimeout(() => {
      setData([
        {
          id: 1,
          name: '规则组1',
          description: '描述1',
          risk_level: 1,
          group_id: 1,
          seclang_mod: {
            match_goal: 'match',
            match_action: 'block',
            match_content: 'content'
          }
        },
        {
          id: 2,
          name: '规则组2',
          description: '描述2',
          risk_level: 2,
          group_id: 2,
          seclang_mod: {
            match_goal: 'match',
            match_action: 'block',
            match_content: 'content'
          }
        }
      ])
    }, 1000)
  }, [ruleId])

  const columns: TableColumnsType<RuleValues> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: '所属规则组',
      dataIndex: 'group_id',
      key: 'group_id'
    },
    {
      title: '规则匹配',
      dataIndex: ['seclang_mod', 'match_goal'],
      key: 'match_goal'
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (_, record) => {
        const riskLevel = record.risk_level
        return <span>{riskLevel === 1 ? '低' : riskLevel === 2 ? '中' : '高'}</span>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* 编辑 */}
          <Button onClick={() => onEdit(record)}>编辑</Button>
        </Space>
      )
    }
  ]

  // 自定义抽屉
  const { showDrawer, renderDrawer } = useWafDrawer({
    defaultTitle: '新增自定义规则',
    width: 600
  })

  const showWafDrawer = () => {
    showDrawer({
      title: '自定义规则',
      content: (
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: 'Please enter user name' }]}>
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="group_id" label="所属规则组" rules={[{ required: true, message: '请选择所属规则组' }]}>
                <Select placeholder="请选择所属规则组">
                  <Option value="xiao">规则组1</Option>
                  <Option value="mao">规则组2</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['seclang_mod', 'match_goal']} label="匹配目标">
                <Select placeholder="请选择匹配目标">
                  <Option value="IP">IP值</Option>
                  <Option value="COOKIE">COOKIE值</Option>
                  <Option value="HEADER">HEADER值</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['seclang_mod', 'match_action']} label="匹配动作">
                <Select placeholder="请选择匹配动作">
                  <Option value="等于">等于</Option>
                  <Option value="不等于">不等于</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['seclang_mod', 'match_content']}
                label="匹配内容"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const currentMatchGoal = getFieldValue(['seclang_mod', 'match_goal'])
                      console.log(value, 433333333)

                      if (!value) {
                        return Promise.reject(new Error('请输入匹配内容'))
                      }

                      if (currentMatchGoal === 'IP') {
                        if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
                          return Promise.reject(new Error('请输入有效的IP地址'))
                        }
                      } else if (currentMatchGoal === 'COOKIE' || currentMatchGoal === 'HEADER') {
                        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                          return Promise.reject(new Error('内容格式应为 user_123 这样的字母数字下划线组合'))
                        }
                      }

                      return Promise.resolve()
                    }
                  })
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="risk_level" label="风险等级" rules={[{ required: true, message: '请选择风险等级' }]} className="mb-0">
                <Select placeholder="Please choose the type" className="w-full">
                  <Option value={0}>低</Option>
                  <Option value={1}>中</Option>
                  <Option value={2}>高</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="规则描述"
                rules={[
                  {
                    required: true,
                    message: '请输入规则描述'
                  }
                ]}>
                <Input.TextArea rows={4} placeholder="请输入规则描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )
    })
  }

  return (
    <Card title={`规则组详情 ID: ${ruleId}`} extra={<Button onClick={goBack}>返回</Button>}>
      <Table<RuleValues> columns={columns} dataSource={data} loading={loading} rowKey="id" />
      {renderDrawer()}
    </Card>
  )
}
