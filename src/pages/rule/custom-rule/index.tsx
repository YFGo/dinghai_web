
import { useState, useEffect } from 'react'
import { useWatch } from 'rc-field-form'
import { Card, Input, Flex, Button, Form, Row, Col, Select,Breadcrumb, DatePicker, message } from 'antd'
import type { TimeRangePickerProps } from 'antd'
import { CustomTable } from './custom-table'
import {DataType} from './custom-table'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useWafModal } from '@/hooks/waf-modal'
import { useWafDrawer } from '@/hooks/waf-drawer'
import { addCustomRule, updateCustomRule, deleteCustomRule } from '@/api/services/rule'
import { RuleFormValues } from '@/types/rules'


const { RangePicker } = DatePicker
const { Option } = Select



export default function CustomRule() {
  const [data, setData] = useState<DataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<RuleFormValues>()
  // 监听表单值的变化
  const matchGoal = useWatch(['seclang_mod', 'match_goal'], form)


  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData([
        { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', tags: ['nice', 'developer'] },
        { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', tags: ['loser'] },
        { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park', tags: ['cool', 'teacher'] }
      ])
      setLoading(false)
    },1000)
  },[])

  // 删除选中项
  const handleDelete = (keys: React.Key[]) => {
    // 这里可以调用API执行删除
    message.success(`删除了 ${keys.join(', ')}`)
    setData(data.filter(item => !keys.includes(item.key)))
    setSelectedRowKeys([])
  }

// 新增规则组
  const onFinish = async (values: RuleFormValues, closeDrawer?: () => void) => {
    try {
      setLoading(true)
      console.log(values, 329783)
      await addCustomRule(values)
      message.success('提交成功')
      // 重置表单
      form.resetFields()
      // 提交成功后关闭抽屉
      closeDrawer && closeDrawer()
    } catch (error) {
      message.error('提交失败') 
    } finally {
      setLoading(false)
    }
  }

  // 自定义抽屉
  const { showDrawer, renderDrawer } = useWafDrawer({
    defaultTitle: '新增自定义规则',
    width: 600
  })
  // 显示抽屉
  const showWafDrawer = () => {
    showDrawer({
      content: (
        <Form layout="vertical" form={form} onFinish={onFinish} >
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
                      console.log(value,433333333)
                      
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
                <Input placeholder={matchGoal === 'IP' ? '例如: 192.168.1.1' : matchGoal === 'COOKIE' ? '例如: user_123, session_id' : matchGoal === 'HEADER' ? '例如: X-Auth-Token, Authorization' : '请输入内容'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="risk_level" label="风险等级" rules={[{ required: true, message: '请选择风险等级' }]} className="mb-0">
                <Select placeholder="Please choose the type" className="w-full">
                  <Option value="1">低</Option>
                  <Option value="2">中</Option>
                  <Option value="3">高</Option>
                  <Option value="4">非常高</Option>
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
      ),
      onOk: close => {
        // 表单验证
        form.validateFields().then(values => {
          console.log('提交表单数据: ', values)
          // 触发表单提交，并传入关闭抽屉的回调函数
          onFinish(values, close)
        })
      }
    })
  }

  // 自定义弹窗
  const { showModal, renderModal } = useWafModal({
    defaultTitle: '删除自定义规则',
    width: 600
  })
  // 显示弹窗
  const showWafModal = () => {
    showModal({
      content: <div>确认删除吗？一旦删除无法恢复</div>,
      onOk: close => {
        console.log('执行新增操作')
        close()
      }
    })
  }

  // 预设时间范围
  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] }
  ]

  // 处理时间选择
  const handleTimeChange = (dates: null | (Dayjs | null)[], dateStrings: [string, string]) => {
    console.log('Selected Time: ', dates, dateStrings)
  }

  return (
    <div>
      <Breadcrumb items={[{ title: '自定义规则' }]} separator=">" />
      <Card className="my-2">
        <Flex className="justify-between">
          <div className="flex gap-4">
            <Input className="w-48 h-10" placeholder="规则名称" />
            <RangePicker
              presets={[
                {
                  label: <span aria-label="Current Time to End of Day">Now ~ EOD</span>,
                  value: () => [dayjs(), dayjs().endOf('day')] // 5.8.0+ support function
                },
                ...rangePresets
              ]}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              onChange={handleTimeChange}
            />
          </div>
          <Button>刷新</Button>
        </Flex>
      </Card>
      <Card>
        <div>
          <Button color="primary" variant="outlined" onClick={showWafDrawer}>
            新增自定义规则
          </Button>
          <Button color="primary" variant="outlined" className="mx-3 mb-3">
            一键导出
          </Button>
          <Button color="primary" variant="outlined" onClick={showWafModal} disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </div>
        <CustomTable data={data} selectedRowKeys={selectedRowKeys} onSelectedRowKeysChange={setSelectedRowKeys} onDelete={handleDelete} loading={loading} />
      </Card>
      {renderModal()}
      {renderDrawer()}
    </div>
  )
}
