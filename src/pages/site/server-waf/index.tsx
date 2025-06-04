import { useState, useEffect } from 'react'
import { message } from 'antd'
import { wafTable } from '@/components/waf-table'
import { getServerList, deleteServer, updateServer } from '@/api/services/site'
import { useWafModal } from '@/hooks/waf-modal'
import { useWafDrawer } from '@/hooks/waf-drawer'

// 定义服务器WAF数据类型
interface ServerWafItem {
  id: number
  name: string
  ip: string
  port: number
  status: string
  createTime: string
  updateTime: string
}

export default function ServerWaf() {
  // 状态管理
  const [loading, setLoading] = useState(false)
  const [serverList, setServerList] = useState<ServerWafItem[]>([])
  
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
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
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
      onClick: (record: ServerWafItem) => handleEdit(record),
    },
    {
      text: '删除',
      danger: true,
      confirm: {
        title: '确认删除',
        description: '确定要删除该服务器吗？删除后无法恢复。',
        onConfirm: (record: ServerWafItem) => handleDelete(record.id),
      },
    },
  ]

  // 获取服务器列表
  const fetchServerList = async () => {
    try {
      setLoading(true)
      const res = await getServerList({})
      if (res.data && Array.isArray(res.data)) {
        setServerList(res.data)
      }
    } catch (error) {
      console.error('获取服务器列表失败:', error)
      message.error('获取服务器列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 编辑服务器
  const handleEdit = (record: ServerWafItem) => {
    drawer.showDrawer({
      title: '编辑服务器',
      content: (close: () => void) => (
        <div>
          {/* 这里可以放置编辑表单 */}
          <p>编辑服务器: {record.name}</p>
        </div>
      ),
      onOk: async (close: () => void) => {
        try {
          // 这里处理表单提交逻辑
          await updateServer({ id: record.id })
          message.success('更新成功')
          fetchServerList()
          close()
        } catch (error) {
          console.error('更新失败:', error)
          message.error('更新失败')
        }
      }
    })
  }

  // 删除服务器
  const handleDelete = async (id: number) => {
    try {
      await deleteServer([id])
      message.success('删除成功')
      fetchServerList()
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  // 添加新服务器
  const handleAdd = () => {
    modal.showModal({
      title: '添加服务器',
      content: (close: () => void) => (
        <div>
          {/* 这里可以放置添加表单 */}
          <p>添加新服务器</p>
        </div>
      ),
      onOk: async (close: () => void) => {
        try {
          // 这里处理表单提交逻辑
          message.success('添加成功')
          fetchServerList()
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
    fetchServerList()
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">服务器WAF管理</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAdd}
        >
          添加服务器
        </button>
      </div>
      
      {wafTable({
        data: serverList,
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
    </div>
  )
}
