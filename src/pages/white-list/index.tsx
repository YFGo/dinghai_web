import { useState, useEffect } from 'react'
import { Card, Input, Flex, Button, Form, Row, Col, Select, message, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { wafTable } from '@/components/waf-table'
import { useWafModal } from '@/hooks/waf-modal'
import { useWafDrawer } from '@/hooks/waf-drawer'
import { getWhiteList, addWhiteList, updateWhiteList, deleteWhiteList } from '@/api/services/white-list'

interface WhiteListValues {
  id: number
  name: string
  description: string
  ip: string
  type: number
  status: number
  created_at: string
  updated_at: string
}

export default function WhiteList() {
  // 数据
  const [data, setData] = useState<WhiteListValues[]>([])
  // 选中项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表单实例
  const [form] = Form.useForm<WhiteListValues>()
  // 根据type判断是修改还是新增
  const [type, setType] = useState<'add' | 'edit'>('add')

  // 自定义抽屉
  const { showDrawer, renderDrawer } = useWafDrawer({
    defaultTitle: '新增白名单',
    width: 600
  })

  // 自定义弹窗
  const { showModal, renderModal } = useWafModal({
    defaultTitle: '删除白名单',
    width: 400
  })

  // 获取白名单列表
  const fetchWhiteList = async () => {
    try {
      setLoading(true)
      const { data } = await getWhiteList({})
      setData(data || [])
    } catch (error) {
      message.error('获取白名单列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 打开添加白名单抽屉
  const handleAdd = () => {
    setType('add')
    form.resetFields()
    showWafDrawer()
  }

  // 打开修改白名单抽屉
  const handleEdit = (record: WhiteListValues) => {
    setType('edit')
    form.setFieldsValue(record)
    showWafDrawer()
  }

  // 删除白名单
  const handleDelete = async (keys: React.Key[]) => {
    try {
      setLoading(true)
      await deleteWhiteList(keys)
      message.success(`删除成功`)
      fetchWhiteList()
    } catch (error) {
      message.error('删除失败')
    } finally {
      setLoading(false)
    }
  }

  // 批量删除白名单
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的白名单')
      return
    }

    showModal({
      title: '删除白名单',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条白名单吗？`,
      onOk: async (close) => {
        await handleDelete(selectedRowKeys)
        close()
      }
    })
  }

  // 提交表单
  const handleSubmit = async (values: WhiteListValues) => {
    try {
      setLoading(true)
      if (type === 'add') {
        await addWhiteList(values)
        message.success('添加成功')
      } else {
        await updateWhiteList(values)
        message.success('修改成功')
      }
      fetchWhiteList()
      return true
    } catch (error) {
      message.error('操作失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  // 显示抽屉
  const showWafDrawer = () => {
    showDrawer({
      title: type === 'add' ? '新增白名单' : '修改白名单',
      content: (
        <Form layout="vertical" form={form}>
          {type === 'edit' && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入白名单名称' }]}>
                <Input placeholder="请输入白名单名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="ip" 
                label="IP地址" 
                rules={[
                  { required: true, message: '请输入IP地址' },
                  {
                    pattern: /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
                    message: '请输入有效的IP地址，支持CIDR格式'
                  }
                ]}
              >
                <Input placeholder="请输入IP地址，例如：192.168.1.1或192.168.1.0/24" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="描述">
                <Input.TextArea rows={4} placeholder="请输入描述信息" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
                <Select placeholder="请选择类型">
                  <Select.Option value={0}>IP白名单</Select.Option>
                  <Select.Option value={1}>URL白名单</Select.Option>
                  <Select.Option value={2}>参数白名单</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Select.Option value={0}>禁用</Select.Option>
                  <Select.Option value={1}>启用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
      onOk: async (close) => {
        try {
          const values = await form.validateFields()
          const success = await handleSubmit(values)
          if (success) {
            close()
          }
        } catch (error) {
          console.error('表单验证失败:', error)
        }
      }
    })
  }

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      ellipsis: true
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        const typeMap = {
          0: 'IP白名单',
          1: 'URL白名单',
          2: '参数白名单'
        }
        return typeMap[type as keyof typeof typeMap] || '未知'
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        return status === 1 ? '启用' : '禁用'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at'
    }
  ]

  // 操作按钮
  const actionButtons = [
    {
      text: '编辑',
      type: 'link' as const,
      onClick: handleEdit
    },
    {
      text: '删除',
      type: 'link' as const,
      danger: true,
      confirm: {
        title: '确认删除',
        description: '确定要删除该白名单吗？',
        onConfirm: (record: WhiteListValues) => handleDelete([record.id])
      }
    }
  ]

  // 初始化加载数据
  useEffect(() => {
    fetchWhiteList()
  }, [])

  return (
    <Card>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增白名单
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete} disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </Space>
        <Input.Search placeholder="搜索白名单" style={{ width: 300 }} onSearch={(value) => console.log(value)} />
      </Flex>

      {wafTable({
        data,
        columns,
        loading,
        rowKey: 'id',
        showRowSelection: true,
        rowSelection: {
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        },
        actionButtons
      })}

      {renderDrawer()}
      {renderModal()}
    </Card>
  )
}
