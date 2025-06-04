import { useState, useEffect } from 'react'
import { message } from 'antd'
import { wafTable } from '@/components/waf-table'
import { addWebApp, updateWebApp } from '@/api/services/site'
import { useWafModal } from '@/hooks/waf-modal'
import { useWafDrawer } from '@/hooks/waf-drawer'

// 定义WAF应用数据类型
interface WafAppItem {
  id: number
  name: string
  url: string
  type: string
  status: string
  createTime: string
  updateTime: string
}

export default function WafApp() {
  // 状态管理
  const [loading, setLoading] = useState(false)
  const [appList, setAppList] = useState<WafAppItem[]>([])
  
  // 使用hooks创建模态框和抽屉
  const modal = useWafModal()
  const drawer = useWafDrawer()

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
          {status === 'active' ? '在线' : '离线'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
  ]

  // 操作按钮配置
  const actionButtons = [
    {
      text: '编辑',
      type: 'primary' as const,
      onClick: (record: WafAppItem) => handleEdit(record),
    },
    {
      text: '删除',
      danger: true,
      confirm: {
        title: '确认删除',
        description: '确定要删除该WAF应用吗？删除后无法恢复。',
        onConfirm: (record: WafAppItem) => handleDelete(record.id),
      },
    },
  ]

  // 获取WAF应用列表
  const fetchAppList = async () => {
    try {
      setLoading(true)
      // 模拟API调用，实际项目中应替换为真实API
      // const res = await getWafAppList({})
      const mockData: WafAppItem[] = [
        {
          id: 1,
          name: '官网应用',
          url: 'https://example.com',
          type: 'Web',
          status: 'active',
          createTime: '2023-05-15 10:30:00',
          updateTime: '2023-06-20 14:45:00'
        },
        {
          id: 2,
          name: '管理后台',
          url: 'https://admin.example.com',
          type: 'Web',
          status: 'active',
          createTime: '2023-05-16 09:20:00',
          updateTime: '2023-06-21 11:30:00'
        },
        {
          id: 3,
          name: 'API服务',
          url: 'https://api.example.com',
          type: 'API',
          status: 'offline',
          createTime: '2023-05-17 14:10:00',
          updateTime: '2023-06-22 16:15:00'
        }
      ];
      setAppList(mockData);
      // 实际API调用应该类似下面的代码
      // if (res.data && Array.isArray(res.data)) {
      //   setAppList(res.data)
      // }
    } catch (error) {
      console.error('获取WAF应用列表失败:', error)
      message.error('获取WAF应用列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 编辑WAF应用
  const handleEdit = (record: WafAppItem) => {
    drawer.showDrawer({
      title: '编辑WAF应用',
      content: (close: () => void) => (
        <div>
          {/* 这里可以放置编辑表单 */}
          <p>编辑WAF应用: {record.name}</p>
        </div>
      ),
      onOk: async (close: () => void) => {
        try {
          // 这里处理表单提交逻辑
          await updateWebApp({ id: record.id })
          message.success('更新成功')
          fetchAppList()
          close()
        } catch (error) {
          console.error('更新失败:', error)
          message.error('更新失败')
        }
      }
    })
  }

  // 删除WAF应用
  const handleDelete = async (id: number) => {
    try {
      // 实际项目中应替换为真实API调用
      // await deleteWafApp([id])
      message.success('删除成功')
      fetchAppList()
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  // 添加新WAF应用
  const handleAdd = () => {
    modal.showModal({
      title: '添加WAF应用',
      content: (close: () => void) => (
        <div>
          {/* 这里可以放置添加表单 */}
          <p>添加新WAF应用</p>
        </div>
      ),
      onOk: async (close: () => void) => {
        try {
          // 这里处理表单提交逻辑
          await addWebApp({})
          message.success('添加成功')
          fetchAppList()
          close()
        } catch (error) {
          console.error('添加失败:', error)
          message.error('添加失败')
        }
      }
    })
  }

  // 初始化加载数据
  useEffect(() => {
    fetchAppList()
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">WAF应用管理</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAdd}
        >
          添加应用
        </button>
      </div>
      
      {wafTable({
        data: appList,
        columns,
        loading,
        actionButtons,
        pagination: {
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        },
        scroll: { x: 1200 }
      })}
      {modal.renderModal()}
      {drawer.renderDrawer()}
    </div>
  )
}
