import { useState, useEffect } from 'react'
import { Space, Button, Input, Form, Select, Card, message, Tag } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { wafTable, TableActionButton } from '../../../components/waf-table'
import { useWafDrawer } from '../../../hooks/waf-drawer'
import { useWafModal } from '../../../hooks/waf-modal'

// 定义站点所有者数据类型
interface SiteOwnerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  sites: number;
  status: 'active' | 'inactive';
  createTime: string;
}

// 模拟数据
const mockData: SiteOwnerData[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `${index + 1}`,
  name: `站点所有者${index + 1}`,
  email: `owner${index + 1}@example.com`,
  phone: `1381234${index.toString().padStart(4, '0')}`,
  sites: Math.floor(Math.random() * 10) + 1,
  status: Math.random() > 0.3 ? 'active' : 'inactive' as 'active' | 'inactive',
  createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
}))

// 定义表单值类型
interface SiteOwnerFormValues {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

// 定义表单组件的 Props 类型
interface SiteOwnerFormProps {
  initialValues?: Partial<SiteOwnerFormValues>;
  onFinish: (values: SiteOwnerFormValues) => void;
}

// 站点所有者表单组件
function SiteOwnerForm({ initialValues, onFinish }: SiteOwnerFormProps) {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item name="name" label="所有者名称" rules={[{ required: true, message: '请输入所有者名称' }]}>
        <Input placeholder="请输入所有者名称" />
      </Form.Item>
      <Form.Item name="email" label="电子邮箱" rules={[{ required: true, message: '请输入电子邮箱' }, { type: 'email', message: '请输入有效的电子邮箱' }]}>
        <Input placeholder="请输入电子邮箱" />
      </Form.Item>
      <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
        <Input placeholder="请输入联系电话" />
      </Form.Item>
      <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
        <Select placeholder="请选择状态">
          <Select.Option value="active">启用</Select.Option>
          <Select.Option value="inactive">禁用</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default function SiteOwner() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SiteOwnerData[]>(mockData)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // 使用全局抽屉和弹窗组件
  const { showDrawer, renderDrawer } = useWafDrawer()
  const { showModal, renderModal } = useWafModal()

  // 加载数据
  const loadData = () => {
    setLoading(true)
    // 模拟API请求
    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 500)
  }

  // 初始加载
  useEffect(() => {
    loadData()
  }, [])

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchSearch = searchText ? 
      item.name.includes(searchText) || 
      item.email.includes(searchText) || 
      item.phone.includes(searchText) : true
    
    const matchStatus = statusFilter === 'all' ? true : item.status === statusFilter
    
    return matchSearch && matchStatus
  })

  // 添加站点所有者
  const handleAdd = () => {
    showDrawer({
      title: '添加站点所有者',
      content: (close) => (
        <SiteOwnerForm 
          initialValues={{ status: 'active' }}
          onFinish={(values: SiteOwnerFormValues) => {
            // 模拟添加操作
            const newOwner: SiteOwnerData = {
              ...values,
              id: `${data.length + 1}`,
              sites: 0,
              createTime: new Date().toISOString().split('T')[0]
            }
            setData([newOwner, ...data])
            message.success('添加成功')
            close()
          }}
        />
      ),
      onOk: (close) => {
        // 表单提交由Form组件内部处理
      }
    })
  }

  // 编辑站点所有者
  const handleEdit = (record: SiteOwnerData) => {
    showDrawer({
      title: '编辑站点所有者',
      content: (close) => (
        <SiteOwnerForm 
          initialValues={record}
          onFinish={(values: SiteOwnerFormValues) => {
            // 模拟编辑操作
            const newData = data.map(item => 
              item.id === record.id ? { ...item, ...values } : item
            )
            setData(newData)
            message.success('编辑成功')
            close()
          }}
        />
      ),
      onOk: (close) => {
        // 表单提交由Form组件内部处理
      }
    })
  }

  // 删除站点所有者
  const handleDelete = (record: SiteOwnerData) => {
    showModal({
      title: '删除确认',
      content: `确定要删除站点所有者 "${record.name}" 吗？此操作不可恢复。`,
      onOk: (close) => {
        // 模拟删除操作
        setData(data.filter(item => item.id !== record.id))
        message.success('删除成功')
        close()
      }
    })
  }

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '所有者名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '关联站点数',
      dataIndex: 'sites',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: 'active' | 'inactive') => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
    }
  ]

  // 操作按钮配置
  const actionButtons: TableActionButton<SiteOwnerData>[] = [
    {
      text: '编辑',
      type: 'primary',
      onClick: handleEdit
    },
    {
      text: '删除',
      danger: true,
      confirm: {
        title: '确认删除',
        description: '删除后数据将无法恢复，确定要删除吗？',
        onConfirm: handleDelete
      }
    }
  ]

  // 渲染表格
  const table = wafTable({
    data: filteredData,
    columns,
    loading,
    actionButtons,
    rowKey: 'id',
    showRowSelection: true,
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条记录`
    },
    scroll: { x: 1200 }
  })

  return (
    <div className="p-6">
      <Card title="站点所有者管理" className="mb-4">
        <div className="flex justify-between mb-4">
          <Space>
            <Input 
              placeholder="搜索所有者名称/邮箱/电话" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Select 
              value={statusFilter} 
              onChange={(value: string) => setStatusFilter(value)}
              style={{ width: 120 }}
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadData}
            >
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加所有者
            </Button>
          </Space>
        </div>
        {table}
      </Card>
      {renderDrawer()}
      {renderModal()}
    </div>
  )
}
