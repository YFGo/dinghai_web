import { Space, Table, Button, Popconfirm } from 'antd'
import type { TableProps, PopconfirmProps } from 'antd'
import { RuleValues } from '@/api/services/rule'

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']


interface CustomTableProps {
  data: RuleValues[]
  selectedRowKeys: React.Key[]
  onSelectedRowKeysChange: (selectedRowKeys: React.Key[]) => void
  onDelete: (selectedRowKeys: React.Key[]) => void
  onEdit: (record: RuleValues) => void
  loading?: boolean
}

export function CustomTable({ data, selectedRowKeys, onSelectedRowKeysChange, onDelete,onEdit, loading = false }: CustomTableProps) {
  
  // 确认删除
  const confirmDelete = (id:number) => {
      onDelete([id])
  }

  // 取消删除
  const cancelDelete: PopconfirmProps['onCancel'] = e => {
    console.log(e)
    // message.error('取消删除')
  }
  
  // 行选择配置
  const rowSelection: TableRowSelection<RuleValues> = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: changeableRowKeys => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 === 0)
          onSelectedRowKeysChange(newSelectedRowKeys)
        }
      },
      {
        key: 'even',
        text: '选择偶数行',
        onSelect: changeableRowKeys => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 !== 0)
          onSelectedRowKeysChange(newSelectedRowKeys)
        }
      }
    ]
  }

  // 列定义配置
  const columns: TableProps<RuleValues>['columns'] = [
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
          <Button onClick={() => onEdit(record)}>编辑</Button>
          <Popconfirm title="确定要删除吗？" description={`确定要删除 ${record.name} 吗？`} onConfirm={() => confirmDelete(record.id)} onCancel={cancelDelete} okText="确定" cancelText="取消">
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return <Table<RuleValues> rowSelection={rowSelection} columns={columns} dataSource={data} loading={loading} rowKey="id" />
}
